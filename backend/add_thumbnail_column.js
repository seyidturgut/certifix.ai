const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'certifix',
    port: process.env.DB_PORT || 8889
};

async function addThumbnailColumn() {
    let connection;
    try {
        console.log('Connecting to database...');
        connection = await mysql.createConnection(dbConfig);
        console.log('Connected.');

        console.log('Checking if thumbnail column exists...');
        const [columns] = await connection.execute(`
            SHOW COLUMNS FROM designs LIKE 'thumbnail'
        `);

        if (columns.length === 0) {
            console.log('Adding thumbnail column...');
            await connection.execute(`
                ALTER TABLE designs
                ADD COLUMN thumbnail LONGTEXT
            `);
            console.log('Thumbnail column added successfully.');
        } else {
            console.log('Thumbnail column already exists.');
        }

    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        if (connection) await connection.end();
    }
}

addThumbnailColumn();
