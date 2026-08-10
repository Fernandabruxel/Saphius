const mysql = require('mysql2');

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'saphius_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ssl: {
        rejectUnauthorized: false
    }
});

const db = pool.promise();
module.exports = db;