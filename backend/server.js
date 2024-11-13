// server.js
const express = require('express');
const path = require('path');         // Import path module
const pool = require('./db');
const app = express();
const PORT = 3000;

// Middleware to parse JSON data
app.use(express.json());

const cors = require('cors');
app.use(cors());

// Serve static files from the frontend folder
app.use(express.static(path.join(__dirname, '../frontend')));  // Adjust path to the frontend folder

// Route to get filtered books
app.get('/api/inventory/filter', async (req, res) => {
    const { title, author, genre, publication_date, isbn } = req.query;

    // Build the SQL query with optional filters
    let query = 'SELECT * FROM Inventory WHERE 1=1'; // 1=1 is a no-op to make adding filters easier
    const values = [];

    if (title) {
        query += ' AND LOWER(title) LIKE $' + (values.length + 1);
        values.push(`%${title.toLowerCase()}%`);
    }
    if (author) {
        query += ' AND LOWER(author) LIKE $' + (values.length + 1);
        values.push(`%${author.toLowerCase()}%`);
    }
    if (genre) {
        query += ' AND LOWER(genre) LIKE $' + (values.length + 1);
        values.push(`%${genre.toLowerCase()}%`);
    }
    if (publication_date) {
        query += ' AND publication_date = $' + (values.length + 1);
        values.push(publication_date);
    }
    if (isbn) {
        query += ' AND isbn = $' + (values.length + 1);
        values.push(isbn);
    }

    try {
        const result = await pool.query(query, values);
        res.json(result.rows);
    } catch (error) {
        console.error("Error filtering books:", error);
        res.status(500).json({ error: "Error filtering books" });
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
        console.error("Error adding book:", error);
        res.status(500).send("Server error");
    }
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
