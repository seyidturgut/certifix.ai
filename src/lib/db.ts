import mysql from 'mysql2/promise';

// Create a connection pool securely
export const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    // Increase packet size for large image uploads (same as backend/index.js)
    multipleStatements: true
});

// Helper to keep connection alive or handle serverless cold starts if needed
// For now, simple pool export is sufficient for Next.js

// Attempt to set packet size on connection
pool.query('SET GLOBAL max_allowed_packet=67108864').catch(err => {
    // This might fail if user lacks permissions, but we try anyway
    console.warn('Could not set max_allowed_packet:', (err as Error).message);
});
