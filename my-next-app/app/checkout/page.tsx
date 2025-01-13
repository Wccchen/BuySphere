"use client";

import React, { useEffect, useState } from "react";
import { useCart } from "../cart/CartContext";
import { v4 as uuidv4 } from "uuid";

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const [cartId, setCartId] = useState("");

  // Initialise uniquecartId
  useEffect(() => {
    const storedCartId = localStorage.getItem("cartId");
    if (storedCartId) {
      setCartId(storedCartId); 
    } else {
      const newCartId = uuidv4(); // Generate cartId
      localStorage.setItem("cartId", newCartId);
      setCartId(newCartId);
    }
  }, []);

  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    const totalAmount = cart.reduce((sum, item) => sum + item.price, 0);

    
    const checkoutData = {
      cartId: cartId, // unique cartId
      products: cart.map((item) => ({
        id: item.id,
        title: item.title,
        price: item.price,
      })),
      totalPrice: totalAmount,
    };

    console.log("Sending checkout data:", JSON.stringify(checkoutData, null, 2));

    try {
      const response = await fetch("https://localhost:7170/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(checkoutData),
      });

      const data = await response.json();

      if (response.ok) {
        alert(`Checkout successful! Cart ID: ${data.cartId}`);
        clearCart();
        localStorage.removeItem("cartId"); //remove cartId
      } else {
        alert(`Checkout failed: ${data.message}`);
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      alert("An error occurred during checkout.");
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Checkout</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty!</p>
      ) : (
        <div>
          <ul>
            {cart.map((item) => (
              <li key={item.id}>
                {item.title} - ${item.price}
              </li>
            ))}
          </ul>
          <div style={{ margin: "10px 0" }}>
            <strong>Total Price:</strong> $
            {cart.reduce((sum, item) => sum + item.price, 0).toFixed(2)}
          </div>
          <button
            onClick={handleCheckout}
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
}
