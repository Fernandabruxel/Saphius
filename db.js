// db.js
const mysql = require('mysql2');

// Criar a conexão com o banco
const pool = mysql.createPool({
    host: 'localhost',      
    user: 'root',           
    password: '14092022Fb',  
    database: 'saphius_db', 
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Usar promises para async/await
const db = pool.promise();

module.exports = db;