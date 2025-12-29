import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { RowDataPacket } from 'mysql2';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password } = body;

        const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM users WHERE email = ? AND password = ?', [email, password]);

        if (rows.length === 0) {
            return NextResponse.json({ error: 'Geçersiz email veya şifre' }, { status: 401 });
        }

        const user = rows[0];

        // Return user data same as backend/index.js
        return NextResponse.json({
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

    } catch (error: any) {
        console.error('Login error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
