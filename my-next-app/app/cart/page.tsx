"use client";

import React from "react";
import useCart from "../context/useCart";
import { Product } from "../../types/Product";

export default function CartPage() {
  const { cart, setCart } = useCart();

  // Remove item from cart
  const removeFromCart = (productId: number) => {
    const updatedCart = cart.filter((item: Product) => item.id !== productId);
    setCart(updatedCart); // Update the cart
  };

  // Calculate total price
  const calculateTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price, 0).toFixed(2);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Your Shopping Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty. Go to <a href="/products">Products</a> to add items!</p>
      ) : (
        <div>
          <ul style={{ listStyleType: "none", padding: 0 }}>
            {cart.map((product: Product) => (
              <li
                key={product.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  margin: "10px 0",
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                }}
              >
                
                <img
                  src={product.image}
                  alt={product.title}
                  style={{ width: "100px", height: "100px", marginRight: "20px" }}
                />
                
                <div style={{ flex: 1 }}>
                  <h2 style={{ margin: "0 0 10px 0" }}>{product.title}</h2>
                  <p style={{ margin: "0 0 5px 0" }}>
                    <strong>Price:</strong> ${product.price}
                  </p>
                  <button
                    style={{
                      backgroundColor: "#ff4d4d",
                      color: "#fff",
                      padding: "10px 20px",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                    onClick={() => removeFromCart(product.id)}
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div style={{ marginTop: "20px", fontSize: "18px" }}>
            <strong>Total Price: </strong>${calculateTotalPrice()}
          </div>
        </div>
      )}
    </div>
  );
}