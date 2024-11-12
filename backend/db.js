// db.js
const { Pool } = require('pg');

// Configure your PostgreSQL connection
const pool = new Pool({
    user: 'postgres',            // Replace with your PostgreSQL username
    host: 'localhost',           // Database server (localhost if running locally)
    database: 'book_inventory',  // Replace with your database name
    password: 'your_password',   // Replace with your PostgreSQL password
    port: 5432,                  // Default PostgreSQL port
});

module.exports = pool;
