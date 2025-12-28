const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'certifix',
    port: process.env.DB_PORT || 3306
};

async function addPreviewImageColumn() {
    let connection;
    try {
        console.log('Connecting to database...');
        connection = await mysql.createConnection(dbConfig);
        console.log('Connected.');

        console.log('Adding preview_image column to certificates table...');

        // check if column exists
        const [rows] = await connection.query(`
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = '${dbConfig.database}' 
            AND TABLE_NAME = 'certificates' 
            AND COLUMN_NAME = 'preview_image'
        `);

        if (rows.length > 0) {
            console.log('preview_image column already exists. Checking type...');
            // Optionally modify it to be sure it's LONGTEXT
            await connection.execute(`
                ALTER TABLE certificates
                MODIFY COLUMN preview_image LONGTEXT
            `);
            console.log('preview_image column type ensured to be LONGTEXT.');
        } else {
            await connection.execute(`
                ALTER TABLE certificates
                ADD COLUMN preview_image LONGTEXT
            `);
            console.log('preview_image column added successfully.');
        }

    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        if (connection) await connection.end();
    }
}

addPreviewImageColumn();
