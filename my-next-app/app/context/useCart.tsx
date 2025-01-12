"use client";

import { useState } from "react";
import { Product } from "../../types/Product";

export default function useCart() {
    const [cart, setCart] = useState<Product[]>([]);

    // Function to add a product to the cart
    const addToCart = (product: Product) => {
        // Check if the product is already in the cart
        const isAlreadyInCart = cart.some((item) => item.id === product.id);
        
        if (!isAlreadyInCart) {
            // Add the new product to the cart
            setCart((prevCart) => [...prevCart, product]);
        }
    };

    // Function to remove a product from the cart
    const removeFromCart = (productId: number) => {
        // Filter out the product with the specified ID
        setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
    };

    // Function to clear all items in the cart
    const clearCart = () => {
        setCart([]);
    };

    return {
        cart,
        setCart,
        addToCart,
        removeFromCart,
        clearCart,
    };
}