import React from "react";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe("pk_test_YOUR_PUBLISHABLE_KEY"); // Replace with your actual Publishable Key

const Checkout = ({ cartItems }) => {
  const handleCheckout = async () => {
    const stripe = await stripePromise;

    const response = await fetch(
      "http://localhost:4000/api/payment/create-checkout-session",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ products: cartItems }),
      }
    );

    const data = await response.json();
    window.location.href = data.url;
  };

  return (
    <button onClick={handleCheckout}>
    </button>
  );
};

export default Checkout;
