import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const body = await request.json();
        const { name, price, yearly_price, type, description, limits, features, is_active } = body;

        const fields = [];
        const values = [];

        if (name !== undefined) { fields.push('name = ?'); values.push(name); }
        if (price !== undefined) { fields.push('price = ?'); values.push(price); }
        if (yearly_price !== undefined) { fields.push('yearly_price = ?'); values.push(yearly_price); }
        if (type !== undefined) { fields.push('type = ?'); values.push(type); }
        if (description !== undefined) { fields.push('description = ?'); values.push(description); }
        if (limits !== undefined) { fields.push('limits = ?'); values.push(JSON.stringify(limits)); }
        if (features !== undefined) { fields.push('features = ?'); values.push(JSON.stringify(features)); }
        if (is_active !== undefined) { fields.push('is_active = ?'); values.push(is_active); }

        if (fields.length === 0) return NextResponse.json({ message: 'No changes' });

        values.push(id);
        await pool.query(`UPDATE plans SET ${fields.join(', ')} WHERE id = ?`, values);
        return NextResponse.json({ message: 'Plan updated' });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        await pool.query('DELETE FROM plans WHERE id = ?', [id]);
        return NextResponse.json({ message: 'Plan deleted' });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
