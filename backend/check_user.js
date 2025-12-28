const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
};

async function checkUser() {
    let connection;
    try {
        console.log('Connecting with config (no DB):', { ...dbConfig, database: undefined, password: '***' });
        connection = await mysql.createConnection({ ...dbConfig, database: undefined });
        console.log('Connected.');

        const [dbs] = await connection.query('SHOW DATABASES');
        const dbNames = dbs.map(d => d.Database);
        console.log('Available databases:', dbNames);

        for (const dbName of dbNames) {
            if (['information_schema', 'mysql', 'performance_schema', 'sys'].includes(dbName)) continue;

            try {
                await connection.query(`USE \`${dbName}\``);
                const [tables] = await connection.query(`SHOW TABLES LIKE 'users'`);
                if (tables.length > 0) {
                    console.log(`Searching in ${dbName}...`);
                    const [rows] = await connection.query(
                        'SELECT id, email, password, role FROM users WHERE email = ?',
                        ['seyitturgut@gmail.com']
                    );
                    if (rows.length > 0) {
                        console.log(`FOUND in ${dbName}:`, rows[0]);
                        return;
                    }
                }
            } catch (err) {
                console.log(`Error checking db ${dbName}:`, err.message);
            }
        }

        console.log('User NOT FOUND in any database.');

    } catch (error) {
        console.error('Error:', error);
    } finally {
        if (connection) await connection.end();
    }
}

checkUser();
