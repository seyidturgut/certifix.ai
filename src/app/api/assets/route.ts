import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { getUserPlanAndUsage } from '@/lib/plan-utils';
import { RowDataPacket } from 'mysql2';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    try {
        let query = 'SELECT * FROM assets';
        let params: any[] = [];
        if (type) {
            query += ' WHERE type = ?';
            params.push(type);
        }
        query += ' ORDER BY created_at DESC';
        const [rows] = await pool.query(query, params);
        return NextResponse.json(rows);
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { id, type, name, content, user_id } = body;

        // --- Plan Check ---
        if (user_id) {
            const { plan, usage } = await getUserPlanAndUsage(user_id);
            if (usage.assets >= plan.limits.assets) {
                return NextResponse.json({ error: 'Görsel yükleme limitiniz doldu.', limit_reached: 'assets' }, { status: 403 });
            }

            const newAssetSizeMB = (content ? content.length : 0) / (1024 * 1024);
            if (usage.storage_mb + newAssetSizeMB > plan.limits.storage_mb) {
                return NextResponse.json({ error: 'Depolama alanınız doldu. Lütfen paketinizi yükseltin.', limit_reached: 'storage' }, { status: 403 });
            }
        }
        // --- End Plan Check ---

        await pool.query(
            'INSERT INTO assets (id, type, name, content, user_id) VALUES (?, ?, ?, ?, ?)',
            [id || `AST-${Date.now()}`, type, name, content, user_id || null]
        );
        return NextResponse.json({ message: 'Asset created' }, { status: 201 });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
