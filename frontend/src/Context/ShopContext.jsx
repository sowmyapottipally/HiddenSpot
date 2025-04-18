import React, { createContext, useEffect, useState } from "react";
import { backend_url } from "../App";

export const ShopContext = createContext(null);

const getDefaultCart = () => {
  let cart = {};
  for (let i = 0; i < 300; i++) {
    cart[i] = 0;
  }
  return cart;
};

const ShopContextProvider = (props) => {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState(getDefaultCart());
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem("wishlist");
    return saved ? JSON.parse(saved) : [];
  });

  // Load products and cart on mount
  useEffect(() => {
    fetch(`${backend_url}/allproducts`)
      .then((res) => res.json())
      .then((data) => setProducts(data));

    if (localStorage.getItem("auth-token")) {
      fetch(`${backend_url}/getcart`, {
        method: "POST",
        headers: {
          Accept: "application/form-data",
          "auth-token": localStorage.getItem("auth-token"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(),
      })
        .then((resp) => resp.json())
        .then((data) => {
          setCartItems(data);
        });
    }
  }, []);

  // Save wishlist to localStorage on change
  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleWishlist = (itemId) => {
    setWishlist((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        try {
          const itemInfo = products.find(
            (product) => product.id === Number(item)
          );
          totalAmount += cartItems[item] * itemInfo.new_price;
        } catch (error) {}
      }
    }
    return totalAmount;
  };

  const getTotalCartItems = () => {
    let totalItem = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        try {
          const itemInfo = products.find(
            (product) => product.id === Number(item)
          );
          totalItem += itemInfo ? cartItems[item] : 0;
        } catch (error) {}
      }
    }
    return totalItem;
  };

  const addToCart = (itemId) => {
    if (!localStorage.getItem("auth-token")) {
      alert("Please Login");
      return;
    }
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    fetch(`${backend_url}/addtocart`, {
      method: "POST",
      headers: {
        Accept: "application/form-data",
        "auth-token": localStorage.getItem("auth-token"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ itemId }),
    });
  };

  const removeFromCart = (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
    fetch(`${backend_url}/removefromcart`, {
      method: "POST",
      headers: {
        Accept: "application/form-data",
        "auth-token": localStorage.getItem("auth-token"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ itemId }),
    });
  };

  const contextValue = {
    products,
    cartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    getTotalCartItems,
    wishlist,
    toggleWishlist, // ✅ exposed for use in Wishlist page
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
