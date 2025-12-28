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

async function addProfileColumns() {
    let connection;
    try {
        console.log('Connecting to database...');
        connection = await mysql.createConnection(dbConfig);
        console.log('Connected.');

        const columnsToAdd = [
            { name: 'profile_image', type: 'LONGTEXT' },
            { name: 'brand_logo', type: 'LONGTEXT' }
        ];

        for (const col of columnsToAdd) {
            console.log(`Checking if ${col.name} column exists...`);
            const [columns] = await connection.execute(`
                SHOW COLUMNS FROM users LIKE '${col.name}'
            `);

            if (columns.length === 0) {
                console.log(`Adding ${col.name} column...`);
                await connection.execute(`
                    ALTER TABLE users
                    ADD COLUMN ${col.name} ${col.type}
                `);
                console.log(`${col.name} column added successfully.`);
            } else {
                console.log(`${col.name} column already exists. Type: ${columns[0].Type}`);
            }
        }

    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        if (connection) await connection.end();
    }
}

addProfileColumns();
