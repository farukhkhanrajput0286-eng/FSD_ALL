// ==========================================
// LIBRARY MANAGEMENT SYSTEM
// CRUD OPERATIONS
// ==========================================


// Express backend ka API URL
const API_URL = "/api/books";


// HTML elements
const bookForm = document.getElementById("bookForm");

const bookId = document.getElementById("bookId");

const title = document.getElementById("title");

const author = document.getElementById("author");

const year = document.getElementById("year");

const booksContainer = document.getElementById("booksContainer");

const formTitle = document.getElementById("formTitle");

const cancelBtn = document.getElementById("cancelBtn");


// ==========================================
// GET - DISPLAY ALL BOOKS
// ==========================================

async function getBooks() {

    try {

        const response = await fetch(API_URL);

        const books = await response.json();

        displayBooks(books);

    } catch (error) {

        console.error("Error:", error);

        booksContainer.innerHTML = `
            <p class="no-books">
                ❌ Unable to load books.
            </p>
        `;
    }
}


// ==========================================
// DISPLAY BOOKS
// ==========================================

function displayBooks(books) {

    booksContainer.innerHTML = "";


    if (books.length === 0) {

        booksContainer.innerHTML = `
            <p class="no-books">
                📚 No books available.
            </p>
        `;

        return;
    }


    books.forEach(book => {

        const card = document.createElement("div");

        card.className = "book-card";


        card.innerHTML = `

            <h3>📖 ${book.title}</h3>

            <p>
                <strong>Author:</strong>
                ${book.author}
            </p>

            <p>
                <strong>Year:</strong>
                ${book.year}
            </p>


            <div class="book-actions">

                <button
                    class="btn edit-btn"
                    onclick="editBook('${book._id}')"
                >
                    ✏️ Edit
                </button>


                <button
                    class="btn delete-btn"
                    onclick="deleteBook('${book._id}')"
                >
                    🗑️ Delete
                </button>

            </div>

        `;


        booksContainer.appendChild(card);

    });
}


// ==========================================
// POST - ADD NEW BOOK
// ==========================================

bookForm.addEventListener("submit", async function (event) {

    event.preventDefault();


    const bookData = {

        title: title.value,

        author: author.value,

        year: year.value

    };


    try {

        // Agar ID hai -> UPDATE
        if (bookId.value) {

            await updateBook(bookId.value, bookData);

        }

        // Agar ID nahi hai -> ADD
        else {

            const response = await fetch(API_URL, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(bookData)

            });


            if (!response.ok) {

                throw new Error("Failed to add book");

            }


            alert("✅ Book added successfully!");

        }


        resetForm();

        getBooks();


    } catch (error) {

        console.error("Error:", error);

        alert("❌ Something went wrong!");

    }

});


// ==========================================
// PUT - UPDATE BOOK
// ==========================================

async function updateBook(id, bookData) {

    try {

        const response = await fetch(`${API_URL}/${id}`, {

            method: "PUT",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(bookData)

        });


        if (!response.ok) {

            throw new Error("Failed to update book");

        }


        alert("✅ Book updated successfully!");

    } catch (error) {

        console.error("Error:", error);

        alert("❌ Unable to update book!");

    }
}


// ==========================================
// EDIT BOOK
// ==========================================

async function editBook(id) {

    try {

        const response = await fetch(`${API_URL}/${id}`);

        const book = await response.json();


        // Form mein existing data fill karna

        bookId.value = book._id;

        title.value = book.title;

        author.value = book.author;

        year.value = book.year;


        // Form title change

        formTitle.innerHTML = "✏️ Update Book";


        // Cancel button show

        cancelBtn.style.display = "inline-block";


        // Page ko form tak scroll

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });


    } catch (error) {

        console.error("Error:", error);

        alert("❌ Unable to get book details!");

    }
}


// ==========================================
// DELETE - DELETE BOOK
// ==========================================

async function deleteBook(id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this book?"
    );


    if (!confirmDelete) {
        return;
    }


    try {

        const response = await fetch(`${API_URL}/${id}`, {

            method: "DELETE"

        });


        if (!response.ok) {

            throw new Error("Failed to delete book");

        }


        alert("🗑️ Book deleted successfully!");


        getBooks();


    } catch (error) {

        console.error("Error:", error);

        alert("❌ Unable to delete book!");

    }
}


// ==========================================
// CANCEL EDIT
// ==========================================

function cancelEdit() {

    resetForm();

}


// ==========================================
// RESET FORM
// ==========================================

function resetForm() {

    bookForm.reset();

    bookId.value = "";

    formTitle.innerHTML = "➕ Add New Book";

    cancelBtn.style.display = "none";

}


// ==========================================
// LOAD BOOKS WHEN PAGE OPENS
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    getBooks();

});