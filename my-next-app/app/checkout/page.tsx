"use client";

import React from "react";
import useCart from "../context/useCart";

export default function CheckoutPage() {
    const { cart, clearCart } = useCart();

    const handleCheckout = async () => {
        if (cart.length === 0) {
            alert("Your cart is empty!");
            return;
        }

        const totalAmount = cart.reduce((sum, item) => sum + item.price, 0);

        try {
            const response = await fetch("/api/checkout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    products: cart.map((item) => ({
                        id: item.id,
                        title: item.title,
                        price: item.price,
                    })),
                    totalPrice: totalAmount,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                alert(`Checkout successful! Order ID: ${data.orderId}`);
                clearCart(); 
            } else {
                alert(`Checkout failed: ${data.message}`);
            }
        } catch (error) {
            alert("An error occurred during checkout.");
        }
    };

    return (
        <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
            <h1>Checkout</h1>
            <button onClick={handleCheckout} style={{ padding: "10px 20px", fontSize: "16px" }}>
                Proceed to Checkout
            </button>
        </div>
    );
}