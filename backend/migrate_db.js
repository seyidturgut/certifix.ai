const mysql = require('mysql2/promise');
require('dotenv').config();

const localConfig = {
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'certifix',
    port: 8889,
    multipleStatements: true,
    typeCast: function (field, next) {
        if (field.type === 'JSON') {
            return JSON.parse(field.string());
        }
        return next();
    }
};

const remoteConfig = {
    host: '160.153.246.164',
    user: 'beyincikisleri_certifixDBusR',
    password: '(A~~Jn[u8LCa',
    database: 'beyincikisleri_certifixDB',
    port: 3306,
    multipleStatements: true,
    ssl: { rejectUnauthorized: false }
};

async function migrate() {
    let localConn, remoteConn;
    try {
        console.log('🔌 Connecting...');
        localConn = await mysql.createConnection(localConfig);
        remoteConn = await mysql.createConnection(remoteConfig);
        console.log('✅ Connected.');

        await remoteConn.query('SET FOREIGN_KEY_CHECKS = 0');

        const [tables] = await localConn.query('SHOW TABLES');
        const tableNames = tables.map(t => Object.values(t)[0]);
        console.log(`📦 Found ${tableNames.length} tables.`);

        for (const table of tableNames) {
            console.log(`\n🔄 Processing ${table}...`);

            // 1. Get Schema
            const [createResult] = await localConn.query(`SHOW CREATE TABLE \`${table}\``);
            await remoteConn.query(`DROP TABLE IF EXISTS \`${table}\``);
            await remoteConn.query(createResult[0]['Create Table']);

            // 2. Identify Valid Columns
            const [columns] = await localConn.query(`SHOW FULL COLUMNS FROM \`${table}\``);
            const validFields = columns
                .filter(col => !col.Extra || !col.Extra.includes('GENERATED'))
                .map(col => col.Field);

            console.log(`   📝 Active Columns: ${validFields.length}/${columns.length}`);

            // 3. Migrate Data
            const selectQuery = `SELECT ${validFields.map(f => `\`${f}\``).join(', ')} FROM \`${table}\``;
            const [rows] = await localConn.query(selectQuery);

            if (rows.length > 0) {
                console.log(`   📥 Migrating ${rows.length} rows...`);

                const fieldList = validFields.map(f => `\`${f}\``).join(', ');
                const CHUNK_SIZE = 50;

                for (let i = 0; i < rows.length; i += CHUNK_SIZE) {
                    const chunk = rows.slice(i, i + CHUNK_SIZE);
                    const placeholders = chunk.map(() => `(${validFields.map(() => '?').join(', ')})`).join(', ');

                    // FIX: Stringify Objects/Arrays for MySQL
                    const values = chunk.flatMap(row => validFields.map(f => {
                        const val = row[f];
                        if (val && typeof val === 'object' && !(val instanceof Date)) {
                            return JSON.stringify(val);
                        }
                        return val;
                    }));

                    await remoteConn.query(
                        `INSERT INTO \`${table}\` (${fieldList}) VALUES ${placeholders}`,
                        values
                    );
                    process.stdout.write('.');
                }
                console.log(' Done.');
            }
        }

        await remoteConn.query('SET FOREIGN_KEY_CHECKS = 1');
        console.log('\n🚀 COMPLETE!');

    } catch (err) {
        console.error('❌ ERROR:', err);
    } finally {
        if (localConn) await localConn.end();
        if (remoteConn) await remoteConn.end();
    }
}

migrate();
