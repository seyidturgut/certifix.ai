import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { full_name, email, company_name, phone, password } = body;
        const id = `user_${Date.now()}`;

        try {
            await pool.query(
                'INSERT INTO users (id, full_name, email, company_name, phone, password, role) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [id, full_name, email, company_name, phone, password, 'USER']
            );

            return NextResponse.json({ id, full_name, email, role: 'USER' }, { status: 201 });

        } catch (dbError: any) {
            if (dbError.code === 'ER_DUP_ENTRY') {
                return NextResponse.json({ error: 'Bu email zaten kayıtlı.' }, { status: 400 });
            }
            throw dbError;
        }

    } catch (error: any) {
        console.error('Register error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
