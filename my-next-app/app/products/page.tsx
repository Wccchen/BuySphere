"use client";
import React from "react";
import { Product } from "../../types/Product"; 
import  useCart  from "../context/useCart";
// Define mockProducts
const mockProducts: Product[] = [
    {
        id: 1,
        title: "Laptop",
        price: 1500,
        description: "A high-performance laptop for all your needs.",
        category: "Electronics",
        image: "/images/Laptop.jpg",
        rating: {
            rate: 4.5,
            count: 120,
        },
    },
    {
        id: 2,
        title: "Smartphone",
        price: 800,
        description: "A sleek smartphone with cutting-edge features.",
        category: "Electronics",
        image: "/images/SmartPhone.jpg",
        rating: {
            rate: 4.7,
            count: 85,
        },
    },
    {
        id: 3,
        title: "Tablet",
        price: 400,
        description: "A versatile tablet perfect for work and entertainment.",
        category: "Electronics",
        image: "/images/Tablet.jpg",
        rating: {
            rate: 4.3,
            count: 150,
        },
    },
];

export default function ProductsPage() {
    const { cart, addToCart } = useCart();

    return (
        <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
            {/* Title */}
            <h1>Products</h1>
            <ul style={{ listStyleType: "none", padding: 0 }}>
                {mockProducts.map((product) => (
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
                        {/* Show products images */}
                        <img
                            src={product.image}
                            alt={product.title}
                            style={{ width: "100px", height: "100px", marginRight: "20px" }}
                        />
                        {/* Show products detail */}
                        <div>
                            <h2 style={{ margin: "0 0 10px 0" }}>{product.title}</h2>
                            <p style={{ margin: "0 0 5px 0" }}>
                                <strong>Price:</strong> ${product.price}
                            </p>
                            <button className="mybutton" onClick={() => addToCart(product)}>
                              Add to Cart
                            </button>
                            <p style={{ margin: "0 0 5px 0" }}>
                                <strong>Category:</strong> {product.category}
                            </p>
                            <p style={{ margin: "0 0 5px 0" }}>{product.description}</p>
                            <p style={{ margin: "0" }}>
                                <strong>Rating:</strong> {product.rating.rate} / 5 ({product.rating.count} reviews)
                            </p>
                        </div>
                    </li>
                ))}
            </ul>

            {/* Cart */}
            <h1>Shopping Cart</h1>
            <ul>
                {cart.map((item) => (
                    <li key={item.id}>
                        {item.title} - ${item.price}
                    </li>
                ))}
            </ul>
        </div>
    );
}