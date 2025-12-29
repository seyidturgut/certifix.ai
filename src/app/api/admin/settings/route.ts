import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { RowDataPacket } from 'mysql2';

// GET all settings
export async function GET() {
    try {
        const [rows] = await pool.query<RowDataPacket[]>('SELECT setting_key, setting_value FROM system_settings');

        // Convert rows to object: { maintenance_mode: 'false', ... }
        const settings: Record<string, any> = {};
        rows.forEach(row => {
            // Try to parse JSON/boolean if possible, otherwise string
            let val = row.setting_value;
            if (val === 'true') val = true;
            if (val === 'false') val = false;
            settings[row.setting_key] = val;
        });

        return NextResponse.json(settings);
    } catch (error: any) {
        console.error('Settings GET Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST update settings
export async function POST(request: Request) {
    try {
        const body = await request.json();
        // body is expected to be { setting_key: value, ... }

        // We iterate over keys and update them
        const promises = Object.entries(body).map(([key, value]) => {
            // Convert boolean/objects to string for storage
            let valToStore = value;
            if (typeof value === 'boolean') valToStore = value.toString();
            else if (typeof value === 'object') valToStore = JSON.stringify(value);

            return pool.query(
                'INSERT INTO system_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?',
                [key, valToStore, valToStore]
            );
        });

        await Promise.all(promises);

        return NextResponse.json({ message: 'Settings updated' });

    } catch (error: any) {
        console.error('Settings POST Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
