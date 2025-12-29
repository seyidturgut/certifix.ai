import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { RowDataPacket } from 'mysql2';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM designs WHERE id = ?', [id]);
        if (rows.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        return NextResponse.json(rows[0]);
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const body = await request.json();
        const { name, design_json, orientation, thumbnail } = body;

        const [result] = await pool.query<any>(
            'UPDATE designs SET name = ?, design_json = ?, orientation = ?, thumbnail = ? WHERE id = ?',
            [name, JSON.stringify(design_json), orientation, thumbnail || null, id]
        );

        if (result.affectedRows === 0) {
            return NextResponse.json({ error: 'Design not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Design updated' });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        await pool.query('DELETE FROM designs WHERE id = ?', [id]);
        return NextResponse.json({ message: 'Design deleted' });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
