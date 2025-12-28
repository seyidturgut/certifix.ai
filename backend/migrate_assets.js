const mysql = require('mysql2/promise');
require('dotenv').config();

async function migrate() {
    const pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT
    });

    try {
        console.log('Starting migration: Adding user_id to assets table...');

        // Check if column exists
        const [columns] = await pool.query('SHOW COLUMNS FROM assets LIKE "user_id"');

        if (columns.length === 0) {
            await pool.query('ALTER TABLE assets ADD COLUMN user_id VARCHAR(191) AFTER id');
            console.log('Successfully added user_id column to assets table.');
        } else {
            console.log('user_id column already exists in assets table.');
        }

        // Also ensure subscriptions table has a default record for existing users? 
        // For now, we'll assume the absence of a subscription means 'Tek Eğitim' or a free trial we'll define.

    } catch (err) {
        console.error('Migration failed:', err.message);
    } finally {
        await pool.end();
    }
}

migrate();
