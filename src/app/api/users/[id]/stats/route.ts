import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { RowDataPacket } from 'mysql2';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const [[{ total }]] = await pool.query<RowDataPacket[]>('SELECT COUNT(*) as total FROM certificates WHERE user_id = ?', [id]);
        const [[{ active }]] = await pool.query<RowDataPacket[]>('SELECT COUNT(*) as active FROM certificates WHERE user_id = ? AND status = "valid"', [id]);
        const [[{ revoked }]] = await pool.query<RowDataPacket[]>('SELECT COUNT(*) as revoked FROM certificates WHERE user_id = ? AND status = "revoked"', [id]);

        return NextResponse.json({
            total_certificates: total,
            active_certificates: active,
            revoked_certificates: revoked
        });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
