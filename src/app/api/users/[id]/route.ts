import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { RowDataPacket } from 'mysql2';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM users WHERE id = ?', [id]);
        if (rows.length === 0) return NextResponse.json({ error: 'User not found' }, { status: 404 });

        const user = rows[0];
        delete user.password;

        return NextResponse.json(user);
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const body = await request.json();
        const { full_name, email, company_name, phone, role, signature_url, profile_image, brand_logo } = body;

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

        if (fields.length === 0) return NextResponse.json({ message: 'No changes' });

        values.push(id);
        await pool.query(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, values);
        return NextResponse.json({ message: 'User updated' });

    } catch (error: any) {
        console.error('Update user error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        await pool.query('DELETE FROM users WHERE id = ?', [id]);
        return NextResponse.json({ message: 'User deleted' });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
