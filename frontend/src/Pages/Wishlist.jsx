import React, { useContext } from "react";
import { ShopContext } from "../Context/ShopContext";
import { Link } from "react-router-dom";
import { backend_url, currency } from "../App";
import "./Wishlist.css";

const Wishlist = () => {
  const { products, wishlist, toggleWishlist } = useContext(ShopContext);

  // ✅ Safe check: If wishlist is not an array, fallback to empty array
  const wishlistItems = Array.isArray(wishlist)
    ? products.filter(p => wishlist.includes(p.id))
    : [];

  return (
    <div className="wishlist-page">
      <h2>Your Wishlist ❤️</h2>
      {wishlistItems.length === 0 ? (
        <p>No items in wishlist. <Link to="/">Browse products</Link></p>
      ) : (
        <div className="wishlist-grid">
          {wishlistItems.map(item => (
            <div key={item.id} className="wishlist-card">
              <img src={backend_url + item.image} alt={item.name} />
              <h4>{item.name}</h4>
              <p>{currency}{item.new_price}</p>
              <div className="wishlist-actions">
                <Link to={`/product/${item.id}`}>View</Link>
                <button onClick={() => toggleWishlist(item.id)}>Remove 💔</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
