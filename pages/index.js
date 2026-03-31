import React, { useMemo, useState } from "react";
import Head from "next/head";
import { ShoppingBag, X, Minus, Plus } from "lucide-react";

const products = [
  {
    id: 1,
    name: "NØIR Core Hoodie",
    price: 140,
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 2,
    name: "NØIR Heavyweight Tee",
    price: 68,
    image:
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 3,
    name: "NØIR Studio Pants",
    price: 118,
    image:
      "https://images.unsplash.com/photo-1506629905607-d9b1d54ddf1c?auto=format&fit=crop&w=1200&q=80"
  }
];

export default function Home() {
  const [cart, setCart] = useState([]);
  const [openCart, setOpenCart] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setOpenCart(true);
  };

  const updateQuantity = (id, change) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(0, item.quantity + change) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const total = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );

  const itemCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const handleCheckout = async () => {
    if (!cart.length || isCheckingOut) return;

    try {
      setIsCheckingOut(true);

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cart })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Checkout failed");
      }

      window.location.href = data.url;
    } catch (error) {
      console.error(error);
      alert(error.message || "Checkout failed. Please try again.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <>
      <Head>
        <title>NØIR</title>
        <meta name="description" content="Luxury streetwear essentials." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div style={styles.page}>
        <header style={styles.header}>
          <div style={styles.headerInner}>
            <div style={styles.logo}>NØIR</div>

            <button style={styles.cartButton} onClick={() => setOpenCart(true)}>
              <ShoppingBag size={18} />
              <span>CART ({itemCount})</span>
            </button>
          </div>
        </header>

        <main>
          <section style={styles.hero}>
            <p style={styles.kicker}>ONLINE EXCLUSIVE</p>
            <h1 style={styles.heroTitle}>
              Dark minimalism. Elevated everyday uniform.
            </h1>
            <p style={styles.heroText}>
              NØIR is a digital-first luxury streetwear label built around clean
              lines, restrained palettes, and statement essentials.
            </p>
          </section>

          <section style={styles.productsSection}>
            <div style={styles.sectionHeader}>
              <p style={styles.kicker}>DROP 01</p>
              <h2 style={styles.sectionTitle}>Featured Pieces</h2>
            </div>

            <div style={styles.grid}>
              {products.map((product) => (
                <div key={product.id} style={styles.card}>
                  <img
                    src={product.image}
                    alt={product.name}
                    style={styles.productImage}
                  />

                  <div style={styles.cardBody}>
                    <div>
                      <h3 style={styles.productName}>{product.name}</h3>
                      <p style={styles.productPrice}>${product.price}</p>
                    </div>

                    <button
                      style={styles.addButton}
                      onClick={() => addToCart(product)}
                    >
                      ADD TO CART
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>

        {openCart && (
          <div style={styles.overlay}>
            <div style={styles.drawer}>
              <div style={styles.drawerHeader}>
                <h2 style={styles.drawerTitle}>CART</h2>
                <button
                  onClick={() => setOpenCart(false)}
                  style={styles.iconButton}
                >
                  <X size={20} />
                </button>
              </div>

              <div style={styles.drawerBody}>
                {cart.length === 0 ? (
                  <p style={styles.emptyText}>Your cart is empty.</p>
                ) : (
                  cart.map((item) => (
                    <div key={item.id} style={styles.cartItem}>
                      <div style={styles.cartTopRow}>
                        <div>
                          <p style={styles.cartItemName}>{item.name}</p>
                          <p style={styles.cartItemMeta}>${item.price}</p>
                        </div>
                        <p>${item.price * item.quantity}</p>
                      </div>

                      <div style={styles.qtyRow}>
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          style={styles.qtyButton}
                        >
                          <Minus size={14} />
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          style={styles.qtyButton}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div style={styles.drawerFooter}>
                <div style={styles.totalRow}>
                  <span>TOTAL</span>
                  <span>${total}</span>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={!cart.length || isCheckingOut}
                  style={{
                    ...styles.checkoutButton,
                    opacity: !cart.length || isCheckingOut ? 0.5 : 1
                  }}
                >
                  {isCheckingOut ? "PROCESSING..." : "CHECKOUT"}
                </button>
              </div>
            </div>
          </div>
        )}

        <footer style={styles.footer}>© 2026 NØIR — ONLINE EXCLUSIVE</footer>
      </div>
    </>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#000",
    color: "#fff",
    fontFamily: "Inter, Arial, sans-serif"
  },
  header: {
    position: "sticky",
    top: 0,
    zIndex: 40,
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(0,0,0,0.92)"
  },
  headerInner: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "20px 24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between"
  },
  logo: {
    fontSize: 18,
    letterSpacing: "0.35em"
  },
  cartButton: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    background: "transparent",
    border: "1px solid rgba(255,255,255,0.14)",
    color: "#fff",
    padding: "10px 14px",
    cursor: "pointer",
    letterSpacing: "0.18em",
    fontSize: 12
  },
  hero: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "90px 24px 60px"
  },
  kicker: {
    fontSize: 12,
    letterSpacing: "0.35em",
    opacity: 0.5
  },
  heroTitle: {
    maxWidth: 900,
    fontSize: 58,
    fontWeight: 300,
    lineHeight: 1.1,
    letterSpacing: "0.05em",
    marginTop: 18
  },
  heroText: {
    maxWidth: 560,
    marginTop: 26,
    fontSize: 16,
    lineHeight: 1.8,
    color: "rgba(255,255,255,0.68)"
  },
  productsSection: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "0 24px 80px"
  },
  sectionHeader: {
    marginBottom: 28
  },
  sectionTitle: {
    marginTop: 10,
    fontSize: 28,
    fontWeight: 300,
    letterSpacing: "0.18em"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: 24
  },
  card: {
    background: "#0a0a0a",
    border: "1px solid rgba(255,255,255,0.08)",
    overflow: "hidden"
  },
  productImage: {
    width: "100%",
    height: 460,
    objectFit: "cover",
    display: "block"
  },
  cardBody: {
    padding: 20,
    display: "flex",
    flexDirection: "column",
    gap: 16
  },
  productName: {
    fontSize: 14,
    letterSpacing: "0.12em",
    margin: 0
  },
  productPrice: {
    marginTop: 8,
    color: "rgba(255,255,255,0.6)"
  },
  addButton: {
    background: "#fff",
    color: "#000",
    border: "none",
    padding: "14px 16px",
    cursor: "pointer",
    letterSpacing: "0.2em",
    fontSize: 11
  },
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.72)",
    display: "flex",
    justifyContent: "flex-end",
    zIndex: 100
  },
  drawer: {
    width: "100%",
    maxWidth: 420,
    height: "100%",
    background: "#000",
    borderLeft: "1px solid rgba(255,255,255,0.08)",
    display: "flex",
    flexDirection: "column",
    padding: 24
  },
  drawerHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24
  },
  drawerTitle: {
    fontSize: 18,
    letterSpacing: "0.24em",
    margin: 0
  },
  iconButton: {
    background: "transparent",
    color: "#fff",
    border: "none",
    cursor: "pointer"
  },
  drawerBody: {
    flex: 1,
    overflowY: "auto"
  },
  emptyText: {
    color: "rgba(255,255,255,0.5)"
  },
  cartItem: {
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    paddingBottom: 18,
    marginBottom: 18
  },
  cartTopRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: 16,
    marginBottom: 14
  },
  cartItemName: {
    margin: 0,
    fontSize: 14,
    letterSpacing: "0.12em"
  },
  cartItemMeta: {
    marginTop: 6,
    color: "rgba(255,255,255,0.5)",
    fontSize: 13
  },
  qtyRow: {
    display: "flex",
    alignItems: "center",
    gap: 12
  },
  qtyButton: {
    background: "transparent",
    border: "1px solid rgba(255,255,255,0.16)",
    color: "#fff",
    width: 32,
    height: 32,
    cursor: "pointer"
  },
  drawerFooter: {
    borderTop: "1px solid rgba(255,255,255,0.08)",
    paddingTop: 18
  },
  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 16,
    fontSize: 14,
    letterSpacing: "0.12em"
  },
  checkoutButton: {
    width: "100%",
    background: "#fff",
    color: "#000",
    border: "none",
    padding: "16px",
    cursor: "pointer",
    letterSpacing: "0.22em",
    fontSize: 11
  },
  footer: {
    borderTop: "1px solid rgba(255,255,255,0.08)",
    textAlign: "center",
    padding: "26px 16px",
    fontSize: 11,
    letterSpacing: "0.28em",
    color: "rgba(255,255,255,0.45)"
  }
};
