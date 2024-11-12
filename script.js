// Array to hold book entries
let books = [];
let nextEntryId = 1; // Initialize Entry ID counter

// Function to add a book
async function addBook(event) {
    event.preventDefault();

    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const genre = document.getElementById('genre').value;
    const pubDate = document.getElementById('pub-date').value;
    const isbn = document.getElementById('isbn').value;

    const newBook = { title, author, genre, publication_date: pubDate, isbn };

    try {
        const response = await fetch('http://localhost:3000/api/inventory', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newBook)
        });

        const addedBook = await response.json();
        fetchBooks();  // Refresh the book list

        // Clear the form
        document.getElementById('bookForm').reset();
    } catch (error) {
        console.error("Error adding book:", error);
    }
}

document.getElementById('bookForm').addEventListener('submit', addBook);


// Fetch and display all books
async function fetchBooks() {
    try {
        const response = await fetch('http://localhost:3000/api/inventory');
        const books = await response.json();
        displayBooks(books);
    } catch (error) {
        console.error("Error fetching books:", error);
    }
}

// Display books in the table
function displayBooks(books) {
    const tableBody = document.querySelector('#booksTable tbody');
    tableBody.innerHTML = ''; // Clear existing entries

    books.forEach((book) => {
        const row = document.createElement('tr');

        // Add each column to the row
        row.innerHTML = `
            <td>${book.entry_id}</td>
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.genre}</td>
            <td>${book.publication_date}</td>
            <td>${book.isbn}</td>
        `;
        
        tableBody.appendChild(row);
    });
}

// Fetch books on page load
document.addEventListener('DOMContentLoaded', fetchBooks);


// Add event listener to the form
document.getElementById('bookForm').addEventListener('submit', addBook);
