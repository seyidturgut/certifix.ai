import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { RowDataPacket } from 'mysql2';

// GET all users (Admin only)
export async function GET() {
    try {
        const [rows] = await pool.query('SELECT id, full_name, email, company_name, phone, role, signature_url, created_at FROM users ORDER BY created_at DESC');
        return NextResponse.json(rows);
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
