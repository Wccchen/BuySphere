"use client";

import React from "react";
import { useCart } from "../cart/CartContext";
import { Product } from "../../types/Product";
import Link from "next/link";

export default function CartPage() {
  const { cart, removeFromCart } = useCart();

  // Calculate total price
  const calculateTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price, 0).toFixed(2);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Your Shopping Cart</h1>
      {cart.length === 0 ? (
        // Show the message when the cart is empty
        <p>
          Your cart is empty. Go to{" "}
          <Link href="/products" className="mybutton">
            Products
          </Link>{" "}
          to add items!
        </p>
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
                    className="mybutton"
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

          {/* Checkout Button */}
          <div style={{ marginTop: "20px", textAlign: "right" }}>
            <Link href="/checkout">
              <button className="mybutton">
                Proceed to Checkout
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}