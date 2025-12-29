import { pool } from '@/lib/db';
import { RowDataPacket } from 'mysql2';

export async function getSystemSettings() {
    try {
        const [rows] = await pool.query<RowDataPacket[]>('SELECT setting_key, setting_value FROM system_settings');

        const settings: Record<string, any> = {
            maintenance_mode: false,
            registration_enabled: true,
            beta_features: false,
            google_login: true,
            linkedin_login: false,
            microsoft_login: false,
        };

        rows.forEach(row => {
            let val = row.setting_value;
            if (val === 'true') val = true;
            if (val === 'false') val = false;
            settings[row.setting_key] = val;
        });

        return settings;
    } catch (error) {
        console.error('Error fetching settings:', error);
        // Return defaults on error to prevent blocking system entirely
        return {
            maintenance_mode: false,
            registration_enabled: true, // Default open if DB fails? Or closed? Let's say open.
        };
    }
}
