import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        await pool.query('DELETE FROM assets WHERE id = ?', [id]);
        return NextResponse.json({ message: 'Asset deleted' });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
