const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'certifix',
    port: process.env.DB_PORT || 8889
};

const INITIAL_PLANS = [
    {
        id: 'tek_egitim',
        name: 'Tek Eğitim',
        price: 990,
        yearly_price: null,
        type: 'one-time',
        description: 'Tek bir eğitim için ideal çözüm.',
        limits: JSON.stringify({
            trainings: 1,
            certificates_per_training: 100,
            designs: 1,
            assets: 5,
            storage_mb: 100
        }),
        features: JSON.stringify({
            footer_required: true,
            linkedin_enabled: false,
            zoom_api: false
        })
    },
    {
        id: 'baslangic',
        name: 'Başlangıç',
        price: 1490,
        yearly_price: 14900,
        type: 'subscription',
        description: 'Bireysel eğitmenler ve küçük gruplar için.',
        limits: JSON.stringify({
            trainings: 5,
            certificates_per_training: 100,
            designs: 3,
            assets: 15,
            storage_mb: 500
        }),
        features: JSON.stringify({
            footer_required: true,
            linkedin_enabled: false,
            zoom_api: false
        })
    },
    {
        id: 'profesyonel',
        name: 'Profesyonel',
        price: 3490,
        yearly_price: 34900,
        type: 'subscription',
        description: 'Yoğun eğitim düzenleyen profesyoneller için.',
        limits: JSON.stringify({
            trainings: 20,
            certificates_per_training: 500,
            designs: 10,
            assets: 50,
            storage_mb: 2048
        }),
        features: JSON.stringify({
            footer_required: true,
            linkedin_enabled: true,
            zoom_api: true,
            status_management: true
        })
    },
    {
        id: 'kurumsal',
        name: 'Kurumsal',
        price: 0, // 'Bize Ulaşın' / Contact based
        yearly_price: null,
        type: 'contract',
        description: 'Büyük ölçekli kurumlar ve holdingler için.',
        limits: JSON.stringify({
            trainings: 999999,
            certificates_per_training: 999999,
            designs: 999999,
            assets: 999999,
            storage_mb: 10240
        }),
        features: JSON.stringify({
            footer_required: true,
            linkedin_enabled: true,
            zoom_api: true,
            white_label: true,
            api_access: true
        })
    }
];

async function migratePlans() {
    let connection;
    try {
        console.log('Connecting to database...');
        connection = await mysql.createConnection(dbConfig);
        console.log('Connected.');

        // 1. Create plans table
        console.log('Creating plans table...');
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS plans (
                id VARCHAR(191) PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                price DECIMAL(10, 2),
                yearly_price DECIMAL(10, 2),
                type ENUM('one-time', 'subscription', 'contract') NOT NULL,
                description TEXT,
                limits JSON,
                features JSON,
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);
        console.log('Plans table created/verified.');

        // 2. Seed initial plans
        console.log('Seeding initial plans...');
        for (const plan of INITIAL_PLANS) {
            await connection.execute(`
                INSERT INTO plans (id, name, price, yearly_price, type, description, limits, features)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE 
                    name = VALUES(name),
                    price = VALUES(price),
                    yearly_price = VALUES(yearly_price),
                    type = VALUES(type),
                    description = VALUES(description),
                    limits = VALUES(limits),
                    features = VALUES(features)
            `, [plan.id, plan.name, plan.price, plan.yearly_price, plan.type, plan.description, plan.limits, plan.features]);
        }
        console.log('Initial plans seeded.');

    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        if (connection) await connection.end();
    }
}

migratePlans();
