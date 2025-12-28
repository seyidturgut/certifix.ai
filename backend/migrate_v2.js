const mysql = require('mysql2/promise');
require('dotenv').config();

async function migrate() {
    const pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT || 3306,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });

    try {
        console.log('Migrating database...');

        // Add signature_url to users table
        try {
            await pool.query('ALTER TABLE users ADD COLUMN signature_url TEXT');
            console.log('Added signature_url to users table');
        } catch (err) {
            if (err.code === 'ER_DUP_COLUMN_NAME') {
                console.log('signature_url column already exists');
            } else {
                throw err;
            }
        }

        // Add design_json and orientation to certificates table
        try {
            await pool.query('ALTER TABLE certificates ADD COLUMN design_json LONGTEXT');
            console.log('Added design_json to certificates table');
        } catch (err) {
            if (err.code === 'ER_DUP_COLUMN_NAME') {
                console.log('design_json column already exists');
            } else {
                throw err;
            }
        }

        try {
            await pool.query("ALTER TABLE certificates ADD COLUMN orientation ENUM('portrait', 'landscape') DEFAULT 'landscape'");
            console.log('Added orientation to certificates table');
        } catch (err) {
            if (err.code === 'ER_DUP_COLUMN_NAME') {
                console.log('orientation column already exists');
            } else {
                throw err;
            }
        }

        console.log('Migration complete');
    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        await pool.end();
    }
}

migrate();
