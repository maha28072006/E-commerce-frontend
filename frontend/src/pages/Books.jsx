import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import "./Books.css";

// Backend API URL
const API_URL = `${import.meta.env.VITE_API_URL}/api/books`;

function Books({ addToCart }) {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch books from backend
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get(API_URL);

        // ✅ SAFELY extract array from backend response
        const booksArray = Array.isArray(response.data)
          ? response.data
          : response.data.data || [];

        setBooks(booksArray);
        setFilteredBooks(booksArray);
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  // Search functionality
  const handleSearch = (searchTerm) => {
    if (!searchTerm.trim()) {
      setFilteredBooks(books);
    } else {
      const filtered = books.filter(
        (book) =>
          book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredBooks(filtered);
    }
  };

  // Loading state
  if (loading) {
    return <div className="loading">Loading books...</div>;
  }

  return (
    <div className="books-container">
      <h2>Our Book Collection</h2>

      {/* Search Bar */}
      <SearchBar onSearch={handleSearch} />

      {/* Books Grid */}
      <div className="books-grid">
        {filteredBooks.length > 0 ? (
          filteredBooks.map((book) => (
            <div key={book._id} className="book-card">
              <Link to={`/book/${book._id}`}>
                <img src={book.image} alt={book.title} />
                <h4>{book.title}</h4>
              </Link>

              <p className="author">by {book.author}</p>
              <p className="price">₹{book.price}</p>

              <button onClick={() => addToCart(book)}>
                Add to Cart
              </button>
            </div>
          ))
        ) : (
          <div className="no-results">
            <p>No books found.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Books;
