import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        await pool.query('UPDATE certificates SET status = "revoked" WHERE id = ?', [id]);
        return NextResponse.json({ message: 'Revoked' });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
