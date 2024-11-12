// server.js
const express = require('express');
const pool = require('./db');
const app = express();
const PORT = 3000;

// Middleware to parse JSON data
app.use(express.json());

// Route to get all books
app.get('/api/inventory', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM Inventory');
        res.json(result.rows);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server error");
    }
});

// Route to add a new book
app.post('/api/inventory', async (req, res) => {
    try {
        const { title, author, genre, publication_date, isbn } = req.body;
        const result = await pool.query(
            'INSERT INTO Inventory (title, author, genre, publication_date, isbn) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [title, author, genre, publication_date, isbn]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server error");
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
