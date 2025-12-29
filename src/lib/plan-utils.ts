import { pool } from '@/lib/db';
import { RowDataPacket } from 'mysql2';

// Hardcoded Plan Defaults (Fallback) - Same as backend/plans.js
export const PLANS: Record<string, any> = {
    tek_egitim: {
        id: 'tek_egitim',
        name: 'Tek Eğitim Paketi',
        type: 'one_time',
        price: 2450,
        limits: { trainings: 1, certificates_per_training: 100, designs: 3, assets: 10, storage_mb: 100 },
        features: { remove_branding: false, analytics: true, priority_support: false, custom_domain: false, bulk_create: true }
    },
    // ... add others if needed as fallback, but mostly fetched from DB
};

export async function getUserPlanAndUsage(userId: string) {
    // Get subscription
    const [subs] = await pool.query<RowDataPacket[]>('SELECT package_id FROM subscriptions WHERE user_id = ? AND status = "ACTIVE"', [userId]);
    const planId = subs.length > 0 ? subs[0].package_id : 'tek_egitim';

    // Get plan from database
    const [planRows] = await pool.query<RowDataPacket[]>('SELECT * FROM plans WHERE id = ?', [planId]);
    let plan;
    if (planRows.length > 0) {
        plan = planRows[0];
        if (typeof plan.limits === 'string') plan.limits = JSON.parse(plan.limits);
        if (typeof plan.features === 'string') plan.features = JSON.parse(plan.features);
    } else {
        plan = PLANS[planId] || PLANS.tek_egitim;
    }

    // Get current usage counters
    const [[{ training_count }]] = await pool.query<RowDataPacket[]>('SELECT COUNT(DISTINCT group_name) as training_count FROM certificates WHERE user_id = ?', [userId]);
    const [[{ certificate_count }]] = await pool.query<RowDataPacket[]>('SELECT COUNT(*) as certificate_count FROM certificates WHERE user_id = ?', [userId]);
    const [[{ design_count }]] = await pool.query<RowDataPacket[]>('SELECT COUNT(*) as design_count FROM designs WHERE user_id = ? AND is_template = false', [userId]);
    const [[{ asset_count, total_size_bytes }]] = await pool.query<RowDataPacket[]>('SELECT COUNT(*) as asset_count, SUM(LENGTH(content)) as total_size_bytes FROM assets WHERE user_id = ?', [userId]);

    return {
        plan,
        usage: {
            trainings: training_count,
            certificates: certificate_count,
            designs: design_count,
            assets: asset_count,
            storage_mb: Math.round((total_size_bytes || 0) / (1024 * 1024)) // MB
        }
    };
}
