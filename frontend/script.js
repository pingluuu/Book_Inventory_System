// Function to display books in the table
function displayBooks(books) {
    const tableBody = document.querySelector('#booksTable tbody');
    if (!tableBody) {
        console.error("Error: Table body element not found.");
        return;
    }

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


// Function to add a book
async function addBook(event) {
    event.preventDefault();

    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const genre = document.getElementById('genre').value;
    const pubDate = document.getElementById('pub-date').value;
    const isbn = document.getElementById('isbn').value;

    // Simple validations based on schema
    if (!title) {
        alert("Title is required.");
        return;
    }
    if (!author) {
        alert("Author is required.");
        return;
    }
    if (!isbn) {
        alert("ISBN is required.");
        return;
    }
    if (!/^\d{13}$/.test(isbn)) { // ISBN validation: 13 digits only
        alert("ISBN must be a 13-digit number.");
        return;
    }

    const newBook = { title, author, genre, publication_date: pubDate, isbn };

    try {
        const response = await fetch('http://localhost:3000/api/inventory', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newBook)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Error adding book');
        }

        //fetchBooks();  // Refresh the book list
        document.getElementById('bookForm').reset();  // Clear the form
        alert("Book added successfully!");
    } catch (error) {
        console.error("Error adding book:", error);
        alert("Failed to add book. " + error.message);
    }
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

        filteredBooks = books; // Update filteredBooks with current filtered data
        // Ensure #booksTable exists before calling displayBooks
        if (document.querySelector('#booksTable')) {
            displayBooks(books); // Display filtered results
        } else {
            console.error("Error: Table element #booksTable not found on this page.");
        }
    } catch (error) {
        console.error("Error filtering books:", error);
    }
}


// Function to reset filters and display all books
function resetFilters() {
    document.getElementById('filterForm').reset();
    document.querySelector('#resultsTable tbody').innerHTML = ''; // Clear the results table
    fetchBooks();
}

// Example filtered book list (replace this with your actual data)
let filteredBooks = []; // Populate this with your filtered data

// Function to export filtered data to CSV
function exportToCSV() {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Entry ID,Title,Author,Genre,Publication Date,ISBN\n"; // CSV headers

    filteredBooks.forEach(book => {
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

    // Create a link element to trigger the download
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "filtered_books_inventory.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link); // Clean up
}

// Function to export filtered data to JSON
function exportToJSON() {
    const jsonContent = JSON.stringify(filteredBooks, null, 2); // Pretty-print JSON
    const blob = new Blob([jsonContent], { type: "application/json" });

    // Create a link element to trigger the download
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "filtered_books_inventory.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link); // Clean up
}


// Add event listeners
document.addEventListener('DOMContentLoaded', () => {
    const bookForm = document.getElementById('bookForm');
    const filterForm = document.getElementById('filterForm');

    if (bookForm) {
        bookForm.addEventListener('submit', addBook);
    }

    if (filterForm) {
        filterForm.addEventListener('submit', (event) => {
            event.preventDefault();
            filterBooks();
        });
    }
});