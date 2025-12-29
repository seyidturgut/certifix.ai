import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

// Helper to get ID from params in Next.js 15+ (async params)
// But for now, standard route handler signature:
// export async function GET(request: Request, { params }: { params: { id: string } })

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const sharedToken = searchParams.get('s');

    try {
        const [rows] = await pool.query<RowDataPacket[]>(`
            SELECT c.*, u.brand_logo, u.company_name, s.package_id
            FROM certificates c
            LEFT JOIN users u ON c.user_id = u.id
            LEFT JOIN subscriptions s ON c.user_id = s.user_id AND s.status = 'ACTIVE'
            WHERE c.id = ?
        `, [id]);

        if (rows.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });

        const certificate = rows[0];

        // If no valid share_token is provided, strip sensitive data
        if (!sharedToken || sharedToken !== certificate.share_token) {
            delete certificate.design_json;
            delete certificate.preview_image;
            (certificate as any).access_level = 'public';
        } else {
            (certificate as any).access_level = 'owner';
        }

        return NextResponse.json(certificate);
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    // Determine if this is a revoke or update based on URL?
    // Next.js App Router doesn't split easily by suffix in file system unless file is named differently.
    // However, the original backend had:
    // PATCH /api/certificates/:id/revoke
    // PATCH /api/certificates/:id (Update)

    // We can handle both here? Or creating a separate directory for revoke.
    // Let's check the request body or URL.
    // Ideally, /api/certificates/[id]/revoke should be a separate file structure.

    // For now, let's implement the logic for general update.
    // If the path ending needs to be detected, we might need to restructure folders.
    // Instead, I will implement Update (PATCH) here.

    // Note: The backend had specific logic for /revoke.
    // I should create `src/app/api/certificates/[id]/revoke/route.ts` for that specific action to keep it clean.
    // This file will handle the general update.

    try {
        const body = await request.json();
        console.log(`[PATCH /api/certificates/${id}] Body:`, body);
        const { recipient_name, recipient_email, program_name, issue_date } = body;

        const [result] = await pool.query<ResultSetHeader>(
            'UPDATE certificates SET recipient_name = ?, recipient_email = ?, program_name = ?, issue_date = ? WHERE id = ?',
            [recipient_name, recipient_email || null, program_name, issue_date, id]
        );

        if (result.affectedRows === 0) {
            return NextResponse.json({ error: 'Sertifika bulunamadı.' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Certificate updated' });

    } catch (error: any) {
        console.error('[PATCH ERROR]:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    console.log(`[DELETE /api/certificates/${id}] Calling delete.`);

    try {
        const [result] = await pool.query<ResultSetHeader>('DELETE FROM certificates WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            console.warn(`[DELETE] No certificate found with ID ${id}`);
            return NextResponse.json({ error: 'Sertifika bulunamadı.' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Certificate deleted' });
    } catch (error: any) {
        console.error('[DELETE ERROR]:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
