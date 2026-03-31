"use client";
import React, { useState } from "react";

const products = [
  { id: 1, name: "Signature Hoodie", price: 120 },
  { id: 2, name: "Luxury Essential Tee", price: 65 },
  { id: 3, name: "Tailored Sweatpants", price: 110 }
];

export default function Home() {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div style={{ background: "black", color: "white", minHeight: "100vh", padding: "40px" }}>
      <h1 style={{ fontSize: "40px", letterSpacing: "10px" }}>NØIR</h1>

      <h2 style={{ marginTop: "40px" }}>SHOP</h2>

      {products.map((p) => (
        <div key={p.id} style={{ marginTop: "20px" }}>
          <span>{p.name} - ${p.price}</span>
          <button
            onClick={() => addToCart(p)}
            style={{ marginLeft: "10px" }}
          >
            Add
          </button>
        </div>
      ))}

      <h2 style={{ marginTop: "40px" }}>CART</h2>
      {cart.map((item, i) => (
        <div key={i}>{item.name}</div>
      ))}

      <p>Total: ${total}</p>
    </div>
  );
}
