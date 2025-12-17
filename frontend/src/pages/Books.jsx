


import "./Books.css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SearchBar from "../components/SearchBar";

function Books({ addToCart }) {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/books")
      .then(res => res.json())
      .then(data => {
        setBooks(data);
        setFilteredBooks(data);
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  const handleSearch = (searchTerm) => {
    if (!searchTerm.trim()) {
      setFilteredBooks(books);
    } else {
      const filtered = books.filter(book => 
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredBooks(filtered);
    }
  };

  if (loading) return <div className="loading">Loading books...</div>;

  return (
    <div className="books-container">
      <h2>Our Book Collection</h2>
      <SearchBar onSearch={handleSearch} />
      
      <div className="books-grid">
        {filteredBooks.map(book => (
          <div key={book._id} className="book-card">
            <Link to={`/book/${book._id}`}>
              <img src={book.image} alt={book.title} />
              <h4>{book.title}</h4>
            </Link>
            <p className="author">by {book.author}</p>
            <p className="price">₹{typeof book.price === 'string' ? book.price.replace('₹', '') : book.price}</p>
            <button onClick={() => addToCart(book)}>
              Add to Cart
            </button>
          </div>
        ))}
      </div>
      
      {filteredBooks.length === 0 && (
        <div className="no-results">
          <p>No books found matching your search.</p>
        </div>
      )}
    </div>
  );
}

export default Books;
