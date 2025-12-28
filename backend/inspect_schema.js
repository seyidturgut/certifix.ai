const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkSchema() {
    const pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT
    });

    try {
        const [tables] = await pool.query('SHOW TABLES');
        console.log('Tables:', tables);

        for (const table of tables) {
            const tableName = Object.values(table)[0];
            const [desc] = await pool.query(`DESCRIBE ${tableName}`);
            console.log(`\nTable: ${tableName}`);
            console.table(desc);
        }
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await pool.end();
    }
}

checkSchema();
