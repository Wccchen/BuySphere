"use client";

import { useState } from "react";
import { Product } from "../../types/Product";

export default function useCart() {
    const [cart, setCart] = useState<Product[]>([]);

    const addToCart = function (product: Product) {
        let isAlreadyInCart = false;
        for (let i = 0; i < cart.length; i++) {
            const item = cart[i];
            if (item.id == product.id) {
                isAlreadyInCart = true;
                break;
            }
        }
        if (!isAlreadyInCart) {
            setCart([...cart, product]);
        }
    };

    return {
        cart,
        setCart,
        addToCart,
    };
}