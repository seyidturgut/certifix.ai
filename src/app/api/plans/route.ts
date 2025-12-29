import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { RowDataPacket } from 'mysql2';

// GET all active plans (Public)
export async function GET() {
    try {
        const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM plans WHERE is_active = TRUE ORDER BY price ASC');
        const parsedRows = rows.map(plan => ({
            ...plan,
            limits: typeof plan.limits === 'string' ? JSON.parse(plan.limits) : plan.limits,
            features: typeof plan.features === 'string' ? JSON.parse(plan.features) : plan.features
        }));
        return NextResponse.json(parsedRows);
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
