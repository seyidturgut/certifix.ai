import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { RowDataPacket } from 'mysql2';

// GET all plans (Admin)
export async function GET() {
    try {
        const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM plans ORDER BY created_at DESC');
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

// POST new plan
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { id, name, price, yearly_price, type, description, limits, features } = body;

        await pool.query(
            'INSERT INTO plans (id, name, price, yearly_price, type, description, limits, features) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [id, name, price, yearly_price, type, description, JSON.stringify(limits), JSON.stringify(features)]
        );
        return NextResponse.json({ message: 'Plan created' });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
