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

async function fixSignatureColumn() {
    let connection;
    try {
        console.log('Connecting to database...');
        connection = await mysql.createConnection(dbConfig);
        console.log('Connected.');

        console.log('Modifying signature_url column to LONGTEXT...');
        await connection.execute(`
            ALTER TABLE users
            MODIFY COLUMN signature_url LONGTEXT
        `);
        console.log('signature_url column modified successfully.');

    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        if (connection) await connection.end();
    }
}

fixSignatureColumn();
