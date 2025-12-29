import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { getUserPlanAndUsage } from '@/lib/plan-utils';
import { RowDataPacket } from 'mysql2';

// GET designs
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    try {
        let query = 'SELECT * FROM designs';
        let params: any[] = [];

        if (userId) {
            query += ' WHERE is_template = true OR user_id = ?';
            params.push(userId);
        } else {
            query += ' WHERE is_template = true';
        }

        query += ' ORDER BY created_at DESC';
        const [rows] = await pool.query(query, params);
        return NextResponse.json(rows);
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST new design
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { id, user_id, name, design_json, is_template, orientation, thumbnail } = body;

        // --- Plan Check ---
        if (!is_template) {
            const { plan, usage } = await getUserPlanAndUsage(user_id);
            if (usage.designs >= plan.limits.designs) {
                return NextResponse.json({ error: 'Tasarım limitiniz doldu. Lütfen paketinizi yükseltin.', limit_reached: 'designs' }, { status: 403 });
            }
        }
        // --- End Plan Check ---

        await pool.query(
            'INSERT INTO designs (id, user_id, name, design_json, is_template, orientation, thumbnail) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [id, user_id, name, JSON.stringify(design_json), is_template || false, orientation || 'landscape', thumbnail || null]
        );
        return NextResponse.json({ message: 'Design saved' }, { status: 201 });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
