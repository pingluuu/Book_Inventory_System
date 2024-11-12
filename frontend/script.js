// Fetch and display all books on page load
document.addEventListener('DOMContentLoaded', fetchBooks);

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

        if (!response.ok) throw new Error('Error adding book');

        fetchBooks();  // Refresh the book list
        document.getElementById('bookForm').reset();  // Clear the form
    } catch (error) {
        console.error("Error adding book:", error);
    }
}

// Function to fetch and display all books
async function fetchBooks() {
    try {
        const response = await fetch('http://localhost:3000/api/inventory');
        if (!response.ok) throw new Error('Error fetching books');
        const books = await response.json();
        displayBooks(books);
    } catch (error) {
        console.error("Error fetching books:", error);
    }
}

// Function to display books in the table
function displayBooks(books) {
    const tableBody = document.querySelector('#booksTable tbody');
    tableBody.innerHTML = ''; // Clear existing entries

    books.forEach(book => {
        const row = document.createElement('tr');
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

// Function to filter books based on form criteria
async function filterBooks() {
    const titleFilter = document.getElementById('filter-title').value;
    const authorFilter = document.getElementById('filter-author').value;
    const genreFilter = document.getElementById('filter-genre').value;
    const pubDateFilter = document.getElementById('filter-pub-date').value;
    const isbnFilter = document.getElementById('filter-isbn').value;

    try {
        
        // Send filters as query parameters
        const response = await fetch(`http://localhost:3000/api/inventory/filter?title=${titleFilter}&author=${authorFilter}&genre=${genreFilter}&publication_date=${pubDateFilter}&isbn=${isbnFilter}`);
        if (!response.ok) throw new Error('Error fetching filtered books');
        const books = await response.json();
        displayBooks(books); // Display filtered results
    } catch (error) {
        console.error("Error filtering books:", error);
    }
}

// Function to display the filtered books in the results table
function displayFilteredBooks(books) {
    const tableBody = document.querySelector('#resultsTable tbody');
    tableBody.innerHTML = ''; // Clear any previous results

    books.forEach(book => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.genre}</td>
            <td>${book.publication_date}</td>
            <td>${book.isbn}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Function to reset filters and display all books
function resetFilters() {
    document.getElementById('filterForm').reset();
    document.querySelector('#resultsTable tbody').innerHTML = ''; // Clear the results table
    fetchBooks();
}

// Automatically fetch books when view_books.html is loaded
if (document.querySelector('#booksTable')) {
    fetchBooks();
}
// Function to export books as CSV
async function exportBooks() {
    try {
        const response = await fetch('http://localhost:3000/api/inventory');
        if (!response.ok) throw new Error('Error fetching books for export');
        const books = await response.json();

        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "Entry ID,Title,Author,Genre,Publication Date,ISBN\n"; // CSV headers

        books.forEach(book => {
            const row = [
                book.entry_id,
                book.title,
                book.author,
                book.genre,
                book.publication_date,
                book.isbn
            ].join(",");
            csvContent += row + "\n";
        });

        // Create a link element to trigger download
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "books_inventory.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link); // Clean up the link element
    } catch (error) {
        console.error("Error exporting books:", error);
    }
}

// Add event listeners
document.addEventListener('DOMContentLoaded', () => {
    const bookForm = document.getElementById('bookForm');
    const filterForm = document.getElementById('filterForm');

    // Fetch and display all books on page load if the table exists
    const booksTable = document.getElementById('booksTable');
    if (booksTable) {
        fetchBooks();
    }

    if (bookForm) {
        bookForm.addEventListener('submit', addBook);
    }

    if (filterForm) {
        filterForm.addEventListener('submit', (event) => {
            event.preventDefault();
            filterBooks();
        });
    }

    // Fetch all books when the page loads
    fetchBooks();
});

