import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { getUserPlanAndUsage } from '@/lib/plan-utils';
import { RowDataPacket } from 'mysql2';

// GET all certificates
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    try {
        let query = 'SELECT * FROM certificates';
        let params: any[] = [];

        if (userId) {
            query += ' WHERE user_id = ?';
            params.push(userId);
        }

        query += ' ORDER BY created_at DESC';
        const [rows] = await pool.query(query, params);
        return NextResponse.json(rows);
    } catch (error: any) {
        console.error('Certificates GET Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST new certificate
export async function POST(request: Request) {
    try {
        const body = await request.json();
        console.log('[POST /api/certificates] Body:', JSON.stringify({ ...body, preview_image: body.preview_image ? '(hidden)' : null }));

        const { id, user_id, recipient_name, recipient_email, program_name, issue_date, design_json, orientation, preview_image, group_name } = body;

        // --- Plan Check ---
        const { plan, usage } = await getUserPlanAndUsage(user_id);

        // 1. Check if this is a NEW training name
        const [[{ exists }]] = await pool.query<RowDataPacket[]>('SELECT COUNT(*) as exists FROM certificates WHERE user_id = ? AND group_name = ?', [user_id, group_name]);

        // Note: RowDataPacket returns numbers as numbers usually, but checking strict equality
        if ((exists as any) === 0 && usage.trainings >= plan.limits.trainings) {
            return NextResponse.json({ error: 'Eğitim limiti aşıldı. Lütfen paketinizi yükseltin.', limit_reached: 'trainings' }, { status: 403 });
        }

        // 2. Check certificates per training limit
        const [[{ current_cert_count }]] = await pool.query<RowDataPacket[]>('SELECT COUNT(*) as current_cert_count FROM certificates WHERE user_id = ? AND group_name = ?', [user_id, group_name]);

        if ((current_cert_count as any) >= plan.limits.certificates_per_training) {
            return NextResponse.json({ error: `Bu eğitim için sertifika limiti (${plan.limits.certificates_per_training}) aşıldı.`, limit_reached: 'certificates_per_training' }, { status: 403 });
        }
        // --- End Plan Check ---

        const share_token = `st_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;

        await pool.query(
            'INSERT INTO certificates (id, user_id, recipient_name, recipient_email, program_name, issue_date, status, design_json, orientation, group_name, preview_image, share_token) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [id, user_id, recipient_name, recipient_email || null, program_name, issue_date, 'valid', design_json, orientation || 'landscape', group_name || null, preview_image || null, share_token]
        );

        return NextResponse.json({ message: 'Created', share_token }, { status: 201 });

    } catch (error: any) {
        console.error('[POST Certificates ERROR]:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
