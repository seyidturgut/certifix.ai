const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
require('dotenv').config();
const { PLANS } = require('./plans');

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Attempt to increase packet size
pool.query('SET GLOBAL max_allowed_packet=67108864').catch(err => {
    console.warn('Could not set max_allowed_packet:', err.message);
});

// Helper to get user plan and current usage
async function getUserPlanAndUsage(userId) {
    // Get subscription
    const [subs] = await pool.query('SELECT package_id FROM subscriptions WHERE user_id = ? AND status = "ACTIVE"', [userId]);
    const planId = subs.length > 0 ? subs[0].package_id : 'tek_egitim'; // Default to Tek Eğitim if no sub

    // Get plan from database
    const [planRows] = await pool.query('SELECT * FROM plans WHERE id = ?', [planId]);
    let plan;
    if (planRows.length > 0) {
        plan = planRows[0];
        // Parse JSON fields if they are strings (some drivers return them parsed, others don't)
        if (typeof plan.limits === 'string') plan.limits = JSON.parse(plan.limits);
        if (typeof plan.features === 'string') plan.features = JSON.parse(plan.features);
    } else {
        // Fallback to internal constants if DB fails or plan not found
        plan = PLANS[planId] || PLANS.tek_egitim;
    }

    // Get current usage counters
    const [[{ training_count }]] = await pool.query('SELECT COUNT(DISTINCT group_name) as training_count FROM certificates WHERE user_id = ?', [userId]);
    const [[{ certificate_count }]] = await pool.query('SELECT COUNT(*) as certificate_count FROM certificates WHERE user_id = ?', [userId]);
    const [[{ design_count }]] = await pool.query('SELECT COUNT(*) as design_count FROM designs WHERE user_id = ? AND is_template = false', [userId]);
    const [[{ asset_count, total_size_bytes }]] = await pool.query('SELECT COUNT(*) as asset_count, SUM(LENGTH(content)) as total_size_bytes FROM assets WHERE user_id = ?', [userId]);

    return {
        plan,
        usage: {
            trainings: training_count,
            certificates: certificate_count,
            designs: design_count,
            assets: asset_count,
            storage_mb: Math.round((total_size_bytes || 0) / (1024 * 1024))
        }
    };
}

// GET all certificates (Admin or for specific user if filter passed)
app.get('/api/certificates', async (req, res) => {
    const { userId } = req.query;
    try {
        let query = 'SELECT * FROM certificates';
        let params = [];

        if (userId) {
            query += ' WHERE user_id = ?';
            params.push(userId);
        }

        query += ' ORDER BY created_at DESC';
        const [rows] = await pool.query(query, params);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// GET single certificate
app.get('/api/certificates/:id', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT c.*, u.brand_logo, u.company_name, s.package_id
            FROM certificates c
            LEFT JOIN users u ON c.user_id = u.id
            LEFT JOIN subscriptions s ON c.user_id = s.user_id AND s.status = 'ACTIVE'
            WHERE c.id = ?
        `, [req.params.id]);

        if (rows.length === 0) return res.status(404).json({ error: 'Not found' });

        const certificate = rows[0];
        const sharedToken = req.query.s;

        // If no valid share_token is provided, strip sensitive data
        if (!sharedToken || sharedToken !== certificate.share_token) {
            delete certificate.design_json;
            delete certificate.preview_image;
            certificate.access_level = 'public';
        } else {
            certificate.access_level = 'owner';
        }

        res.json(certificate);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// POST new certificate
app.post('/api/certificates', async (req, res) => {
    console.log('[POST /api/certificates] Body:', JSON.stringify({ ...req.body, preview_image: req.body.preview_image ? '(hidden)' : null }));
    const { id, user_id, recipient_name, recipient_email, program_name, issue_date, design_json, orientation, preview_image, group_name } = req.body;

    try {
        // --- Plan Check ---
        const { plan, usage } = await getUserPlanAndUsage(user_id);

        // 1. Check if this is a NEW training name
        const [[{ exists }]] = await pool.query('SELECT COUNT(*) as exists FROM certificates WHERE user_id = ? AND group_name = ?', [user_id, group_name]);
        if (exists === 0 && usage.trainings >= plan.limits.trainings) {
            return res.status(403).json({ error: 'Eğitim limiti aşıldı. Lütfen paketinizi yükseltin.', limit_reached: 'trainings' });
        }

        // 2. Check certificates per training limit
        const [[{ current_cert_count }]] = await pool.query('SELECT COUNT(*) as current_cert_count FROM certificates WHERE user_id = ? AND group_name = ?', [user_id, group_name]);
        if (current_cert_count >= plan.limits.certificates_per_training) {
            return res.status(403).json({ error: `Bu eğitim için sertifika limiti (${plan.limits.certificates_per_training}) aşıldı.`, limit_reached: 'certificates_per_training' });
        }
        // --- End Plan Check ---

        const share_token = `st_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;

        await pool.query(
            'INSERT INTO certificates (id, user_id, recipient_name, recipient_email, program_name, issue_date, status, design_json, orientation, group_name, preview_image, share_token) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [id, user_id, recipient_name, recipient_email || null, program_name, issue_date, 'valid', design_json, orientation || 'landscape', group_name || null, preview_image || null, share_token]
        );
        res.status(201).json({ message: 'Created', share_token });
    } catch (error) {
        console.error('[POST ERROR]:', error);
        res.status(500).json({ error: error.message });
    }
});

// PATCH revoke certificate
app.patch('/api/certificates/:id/revoke', async (req, res) => {
    try {
        await pool.query('UPDATE certificates SET status = "revoked" WHERE id = ?', [req.params.id]);
        res.json({ message: 'Revoked' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// DELETE certificate
app.delete('/api/certificates/:id', async (req, res) => {
    console.log(`[DELETE /api/certificates/${req.params.id}] Calling delete.`);
    try {
        const [result] = await pool.query('DELETE FROM certificates WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            console.warn(`[DELETE] No certificate found with ID ${req.params.id}`);
            return res.status(404).json({ error: 'Sertifika bulunamadı.' });
        }
        res.json({ message: 'Certificate deleted' });
    } catch (error) {
        console.error('[DELETE ERROR]:', error);
        res.status(500).json({ error: error.message });
    }
});

// UPDATE certificate
app.patch('/api/certificates/:id', async (req, res) => {
    console.log(`[PATCH /api/certificates/${req.params.id}] Body:`, req.body);
    const { recipient_name, recipient_email, program_name, issue_date } = req.body;
    try {
        const [result] = await pool.query(
            'UPDATE certificates SET recipient_name = ?, recipient_email = ?, program_name = ?, issue_date = ? WHERE id = ?',
            [recipient_name, recipient_email || null, program_name, issue_date, req.params.id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Sertifika bulunamadı.' });
        }
        res.json({ message: 'Certificate updated' });
    } catch (error) {
        console.error('[PATCH ERROR]:', error);
        res.status(500).json({ error: error.message });
    }
});

// REGISTER endpoint
app.post('/api/register', async (req, res) => {
    const { full_name, email, company_name, phone, password } = req.body;
    const id = `user_${Date.now()}`;
    try {
        await pool.query(
            'INSERT INTO users (id, full_name, email, company_name, phone, password, role) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [id, full_name, email, company_name, phone, password, 'USER']
        );
        res.status(201).json({ id, full_name, email, role: 'USER' });
    } catch (error) {
        console.error(error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: 'Bu email zaten kayıtlı.' });
        }
        res.status(500).json({ error: error.message });
    }
});

// LOGIN endpoint
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password]);
        if (rows.length === 0) {
            return res.status(401).json({ error: 'Geçersiz email veya şifre' });
        }
        const user = rows[0];
        res.json({
            id: user.id,
            email: user.email,
            role: user.role,
            full_name: user.full_name,
            company_name: user.company_name,
            phone: user.phone,
            signature_url: user.signature_url,
            profile_image: user.profile_image,
            brand_logo: user.brand_logo
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// GET all users (Admin only - simplification: no actual auth middleware yet)
app.get('/api/users', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT id, full_name, email, company_name, phone, role, signature_url, created_at FROM users ORDER BY created_at DESC');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// GET single user details
app.get('/api/users/:id', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ error: 'User not found' });

        // Remove password from response
        const user = rows[0];
        delete user.password;

        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// UPDATE user
// UPDATE user
// UPDATE user
app.patch('/api/users/:id', async (req, res) => {
    const { full_name, email, company_name, phone, role, signature_url, profile_image, brand_logo } = req.body;
    console.log(`[PATCH /users/${req.params.id}] Received update request.`);
    // console.log('Body keys:', Object.keys(req.body)); 
    // Commented out to avoid clutter, enable if needed.

    try {
        // Build dynamic query
        const fields = [];
        const values = [];

        if (full_name !== undefined) { fields.push('full_name = ?'); values.push(full_name); }
        if (email !== undefined) { fields.push('email = ?'); values.push(email); }
        if (company_name !== undefined) { fields.push('company_name = ?'); values.push(company_name); }
        if (phone !== undefined) { fields.push('phone = ?'); values.push(phone); }
        if (role !== undefined) { fields.push('role = ?'); values.push(role); }
        if (signature_url !== undefined) { fields.push('signature_url = ?'); values.push(signature_url); }
        if (profile_image !== undefined) { fields.push('profile_image = ?'); values.push(profile_image); }
        if (brand_logo !== undefined) { fields.push('brand_logo = ?'); values.push(brand_logo); }

        if (fields.length === 0) return res.json({ message: 'No changes' });

        values.push(req.params.id);

        console.log(`Updating ${fields.length} fields for user ${req.params.id}`);

        await pool.query(
            `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
            values
        );
        res.json({ message: 'User updated' });
    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({ error: error.message });
    }
});

// DELETE user
app.delete('/api/users/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM users WHERE id = ?', [req.params.id]);
        res.json({ message: 'User deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// GET user stats
// GET designs (Templates for everyone, private designs for owner)
app.get('/api/designs', async (req, res) => {
    const { userId } = req.query;
    try {
        let query = 'SELECT * FROM designs';
        let params = [];

        if (userId) {
            query += ' WHERE is_template = true OR user_id = ?';
            params.push(userId);
        } else {
            query += ' WHERE is_template = true';
        }

        query += ' ORDER BY created_at DESC';
        const [rows] = await pool.query(query, params);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// GET single design
app.get('/api/designs/:id', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM designs WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// POST new design or template
app.post('/api/designs', async (req, res) => {
    const { id, user_id, name, design_json, is_template, orientation, thumbnail } = req.body;
    try {
        // --- Plan Check ---
        if (!is_template) {
            const { plan, usage } = await getUserPlanAndUsage(user_id);
            if (usage.designs >= plan.limits.designs) {
                return res.status(403).json({ error: 'Tasarım limitiniz doldu. Lütfen paketinizi yükseltin.', limit_reached: 'designs' });
            }
        }
        // --- End Plan Check ---

        await pool.query(
            'INSERT INTO designs (id, user_id, name, design_json, is_template, orientation, thumbnail) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [id, user_id, name, JSON.stringify(design_json), is_template || false, orientation || 'landscape', thumbnail || null]
        );
        res.status(201).json({ message: 'Design saved' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// PUT update design
app.put('/api/designs/:id', async (req, res) => {
    const { name, design_json, orientation, thumbnail } = req.body;
    const { id } = req.params;
    try {
        const [result] = await pool.query(
            'UPDATE designs SET name = ?, design_json = ?, orientation = ?, thumbnail = ? WHERE id = ?',
            [name, JSON.stringify(design_json), orientation, thumbnail || null, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Design not found' });
        }

        res.json({ message: 'Design updated' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// DELETE design
app.delete('/api/designs/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM designs WHERE id = ?', [req.params.id]);
        res.json({ message: 'Design deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// GET assets by type
app.get('/api/assets', async (req, res) => {
    const { type } = req.query;
    try {
        let query = 'SELECT * FROM assets';
        let params = [];
        if (type) {
            query += ' WHERE type = ?';
            params.push(type);
        }
        query += ' ORDER BY created_at DESC';
        const [rows] = await pool.query(query, params);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// POST new asset
app.post('/api/assets', async (req, res) => {
    const { id, type, name, content, user_id } = req.body;
    try {
        // --- Plan Check ---
        if (user_id) {
            const { plan, usage } = await getUserPlanAndUsage(user_id);
            if (usage.assets >= plan.limits.assets) {
                return res.status(403).json({ error: 'Görsel yükleme limitiniz doldu.', limit_reached: 'assets' });
            }

            const newAssetSizeMB = (content ? content.length : 0) / (1024 * 1024);
            if (usage.storage_mb + newAssetSizeMB > plan.limits.storage_mb) {
                return res.status(403).json({ error: 'Depolama alanınız doldu. Lütfen paketinizi yükseltin.', limit_reached: 'storage' });
            }
        }
        // --- End Plan Check ---

        await pool.query(
            'INSERT INTO assets (id, type, name, content, user_id) VALUES (?, ?, ?, ?, ?)',
            [id || `AST-${Date.now()}`, type, name, content, user_id || null]
        );
        res.status(201).json({ message: 'Asset created' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// DELETE asset
app.delete('/api/assets/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM assets WHERE id = ?', [req.params.id]);
        res.json({ message: 'Asset deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/users/:id/usage', async (req, res) => {
    try {
        const data = await getUserPlanAndUsage(req.params.id);
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/users/:id/stats', async (req, res) => {
    try {
        const [[{ total }]] = await pool.query('SELECT COUNT(*) as total FROM certificates WHERE user_id = ?', [req.params.id]);
        const [[{ active }]] = await pool.query('SELECT COUNT(*) as active FROM certificates WHERE user_id = ? AND status = "valid"', [req.params.id]);
        const [[{ revoked }]] = await pool.query('SELECT COUNT(*) as revoked FROM certificates WHERE user_id = ? AND status = "revoked"', [req.params.id]);

        res.json({
            total_certificates: total,
            active_certificates: active,
            revoked_certificates: revoked
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});


// PLAN MANAGEMENT

// GET all active plans (Public)
app.get('/api/plans', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM plans WHERE is_active = TRUE ORDER BY price ASC');
        const parsedRows = rows.map(plan => ({
            ...plan,
            limits: typeof plan.limits === 'string' ? JSON.parse(plan.limits) : plan.limits,
            features: typeof plan.features === 'string' ? JSON.parse(plan.features) : plan.features
        }));
        res.json(parsedRows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// ADMIN ENDPOINTS FOR PLANS

// GET all plans
app.get('/api/admin/plans', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM plans ORDER BY created_at DESC');
        const parsedRows = rows.map(plan => ({
            ...plan,
            limits: typeof plan.limits === 'string' ? JSON.parse(plan.limits) : plan.limits,
            features: typeof plan.features === 'string' ? JSON.parse(plan.features) : plan.features
        }));
        res.json(parsedRows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// POST new plan
app.post('/api/admin/plans', async (req, res) => {
    const { id, name, price, yearly_price, type, description, limits, features } = req.body;
    try {
        await pool.query(
            'INSERT INTO plans (id, name, price, yearly_price, type, description, limits, features) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [id, name, price, yearly_price, type, description, JSON.stringify(limits), JSON.stringify(features)]
        );
        res.json({ message: 'Plan created' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// PATCH update plan
app.patch('/api/admin/plans/:id', async (req, res) => {
    const { name, price, yearly_price, type, description, limits, features, is_active } = req.body;
    try {
        const fields = [];
        const values = [];

        if (name !== undefined) { fields.push('name = ?'); values.push(name); }
        if (price !== undefined) { fields.push('price = ?'); values.push(price); }
        if (yearly_price !== undefined) { fields.push('yearly_price = ?'); values.push(yearly_price); }
        if (type !== undefined) { fields.push('type = ?'); values.push(type); }
        if (description !== undefined) { fields.push('description = ?'); values.push(description); }
        if (limits !== undefined) { fields.push('limits = ?'); values.push(JSON.stringify(limits)); }
        if (features !== undefined) { fields.push('features = ?'); values.push(JSON.stringify(features)); }
        if (is_active !== undefined) { fields.push('is_active = ?'); values.push(is_active); }

        if (fields.length === 0) return res.json({ message: 'No changes' });

        values.push(req.params.id);
        await pool.query(`UPDATE plans SET ${fields.join(', ')} WHERE id = ?`, values);
        res.json({ message: 'Plan updated' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// DELETE plan
app.delete('/api/admin/plans/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM plans WHERE id = ?', [req.params.id]);
        res.json({ message: 'Plan deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
