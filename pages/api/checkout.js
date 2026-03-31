import React, { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, X } from "lucide-react";

const products = [
  {
    id: 1,
    name: "Signature Hoodie",
    price: 120,
    image: "https://images.unsplash.com/photo-1520975916090-3105956dac38"
  },
  {
    id: 2,
    name: "Luxury Essential Tee",
    price: 65,
    image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b"
  },
  {
    id: 3,
    name: "Tailored Sweatpants",
    price: 110,
    image: "https://images.unsplash.com/photo-1516826957135-700dedea698c"
  }
];

export default function NoirWebsite() {
  const [cart, setCart] = useState([]);
  const [openCart, setOpenCart] = useState(false);

  const addToCart = (product) => {
    setCart([...cart, product]);
    setOpenCart(true);
  };

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="bg-black text-white min-h-screen font-sans">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-10 py-6 border-b border-gray-800 backdrop-blur-md">
        <h1 className="text-2xl tracking-[0.3em] font-light">NØIR</h1>
        <div className="flex items-center gap-8 text-sm uppercase tracking-wide">
          <a href="#" className="hover:text-gray-400">Shop</a>
          <a href="#" className="hover:text-gray-400">Collections</a>
          <a href="#" className="hover:text-gray-400">About</a>
          <div className="relative cursor-pointer" onClick={() => setOpenCart(true)}>
            <ShoppingBag className="w-5 h-5" />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 text-xs bg-white text-black rounded-full px-1">
                {cart.length}
              </span>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center py-40 px-6">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-6xl md:text-8xl font-extralight tracking-wide"
        >
          NØIR
        </motion.h2>
        <p className="mt-6 text-gray-400 max-w-xl text-sm tracking-wide">
          Refined streetwear. Minimal form. Maximum presence.
        </p>
        <button className="mt-10 px-10 py-3 border border-white hover:bg-white hover:text-black transition-all tracking-widest text-xs">
          SHOP COLLECTION
        </button>
      </section>

      {/* Products */}
      <section className="px-10 pb-28 grid md:grid-cols-3 gap-10">
        {products.map((product) => (
          <motion.div
            key={product.id}
            whileHover={{ scale: 1.05 }}
            className="group bg-neutral-900 rounded-2xl overflow-hidden"
          >
            <div className="relative">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-96 object-cover opacity-90 group-hover:opacity-100 transition"
              />
              <button
                onClick={() => addToCart(product)}
                className="absolute bottom-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-white text-black text-xs tracking-widest opacity-0 group-hover:opacity-100 transition"
              >
                ADD TO CART
              </button>
            </div>
            <div className="p-6 flex justify-between items-center">
              <h3 className="text-sm tracking-wide">{product.name}</h3>
              <p className="text-gray-400 text-sm">${product.price}</p>
            </div>
          </motion.div>
        ))}
      </section>

      {/* Cart Drawer */}
      {openCart && (
        <div className="fixed inset-0 bg-black/70 flex justify-end z-50">
          <div className="w-full md:w-[400px] bg-black border-l border-gray-800 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg tracking-widest">CART</h2>
              <X className="cursor-pointer" onClick={() => setOpenCart(false)} />
            </div>

            {cart.length === 0 ? (
              <p className="text-gray-500 text-sm">Your cart is empty.</p>
            ) : (
              <div className="space-y-4">
                {cart.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span>{item.name}</span>
                    <span>${item.price}</span>
                  </div>
                ))}

                <div className="border-t border-gray-800 pt-4 flex justify-between">
                  <span>Total</span>
                  <span>${total}</span>
                </div>

                <button
                  onClick={async () => {
                    const res = await fetch('/api/checkout', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ items: cart })
                    });

                    const data = await res.json();
                    window.location.href = data.url;
                  }}
                  className="w-full mt-6 py-3 bg-white text-black text-xs tracking-widest hover:opacity-90"
                >
                  CHECKOUT
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}}
      <footer className="border-t border-gray-800 py-12 text-center text-gray-500 text-xs tracking-widest">
        © 2026 NØIR — ONLINE EXCLUSIVE
      </footer>
    </div>
  );
}
