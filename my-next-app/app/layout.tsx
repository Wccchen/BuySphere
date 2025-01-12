import React from "react";
import Link from "next/link";
import "./globals.css";
import { CartProvider } from "./cart/CartContext";

export const metadata = {
  title: "MyShop",
  description: "A simple shopping website",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white">
        <CartProvider>
          {/* Navigation Bar */}
          <nav className="bg-gray-800 text-white shadow-md">
            <div className="container mx-auto flex justify-between items-center p-4">
              {/* Brand Logo */}
              <Link
                href="/"
                className="text-2xl font-bold hover:text-blue-400"
              >
                Buysphere
              </Link>

              {/* Navigation Links */}
              <div className="flex space-x-6">
                <Link
                  href="/"
                  className="hover:text-blue-400 px-3 py-2 border-b-2 border-transparent hover:border-blue-400"
                >
                  Home
                </Link>
                <Link
                  href="/products"
                  className="hover:text-blue-400 px-3 py-2 border-b-2 border-transparent hover:border-blue-400"
                >
                  Products
                </Link>
                <Link
                  href="/cart"
                  className="hover:text-blue-400 px-3 py-2 border-b-2 border-transparent hover:border-blue-400"
                >
                  Cart
                </Link>
              </div>
            </div>
          </nav>

          {/* Main Content */}
          <main className="container mx-auto p-4">{children}</main>

          {/* Footer */}
          <footer className="bg-gray-900 text-gray-400 text-center py-4 mt-8">
            <p>
              © {new Date().getFullYear()} Buysphere. All rights reserved.
            </p>
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}