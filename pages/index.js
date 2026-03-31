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
              <ShoppingBag size={16} />
              <span>CART ({itemCount})</span>
            </button>
          </div>
        </header>

        <main>
          <section style={styles.hero}>
            <div style={styles.heroInner}>
              <p style={styles.kicker}>ONLINE EXCLUSIVE</p>
              <h1 style={styles.heroTitle}>
                Dark minimalism.
                <br />
                Elevated everyday uniform.
              </h1>
              <p style={styles.heroText}>
                NØIR is a digital-first luxury streetwear label built around
                clean silhouettes, monochrome tones, and premium essentials.
              </p>
            </div>
          </section>

          <section style={styles.productsSection}>
            <div style={styles.sectionHeader}>
              <div>
                <p style={styles.sectionKicker}>DROP 01</p>
                <h2 style={styles.sectionTitle}>Featured Pieces</h2>
              </div>
            </div>

            <div style={styles.grid}>
              {products.map((product) => (
                <div
                  key={product.id}
                  style={styles.card}
                  onMouseEnter={(e) => {
                    const btn = e.currentTarget.querySelector(".hoverButton");
                    if (btn) btn.style.opacity = "1";
                    const img = e.currentTarget.querySelector(".productImage");
                    if (img) {
                      img.style.transform = "scale(1.03)";
                      img.style.opacity = "1";
                    }
                  }}
                  onMouseLeave={(e) => {
                    const btn = e.currentTarget.querySelector(".hoverButton");
                    if (btn) btn.style.opacity = "0";
                    const img = e.currentTarget.querySelector(".productImage");
                    if (img) {
                      img.style.transform = "scale(1)";
                      img.style.opacity = "0.9";
                    }
                  }}
                >
                  <div style={styles.imageWrap}>
                    <img
                      className="productImage"
                      src={product.image}
                      alt={product.name}
                      style={styles.productImage}
                    />
                    <button
                      className="hoverButton"
                      style={styles.hoverAddButton}
                      onClick={() => addToCart(product)}
                    >
                      ADD TO CART
                    </button>
                  </div>

                  <div style={styles.cardFooter}>
                    <h3 style={styles.productName}>{product.name}</h3>
                    <p style={styles.productPrice}>${product.price}</p>
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
                        <p style={styles.cartLineTotal}>
                          ${item.price * item.quantity}
                        </p>
                      </div>

                      <div style={styles.qtyRow}>
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          style={styles.qtyButton}
                        >
                          <Minus size={14} />
                        </button>
                        <span style={styles.qtyText}>{item.quantity}</span>
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
                  <span style={styles.totalLabel}>TOTAL</span>
                  <span style={styles.totalValue}>${total}</span>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={!cart.length || isCheckingOut}
                  style={{
                    ...styles.checkoutButton,
                    opacity: !cart.length || isCheckingOut ? 0.45 : 1,
                    cursor:
                      !cart.length || isCheckingOut ? "not-allowed" : "pointer"
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
    background:
      "linear-gradient(to bottom, #000000 0%, #050505 35%, #000000 100%)",
    color: "#ffffff",
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  },
  header: {
    position: "sticky",
    top: 0,
    zIndex: 50,
    background: "rgba(0, 0, 0, 0.82)",
    backdropFilter: "blur(10px)",
    borderBottom: "1px solid rgba(255,255,255,0.08)"
  },
  headerInner: {
    maxWidth: "1280px",
    margin: "0 auto",
    padding: "20px 24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between"
  },
  logo: {
    fontSize: "18px",
    letterSpacing: "0.35em",
    fontWeight: 400
  },
  cartButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "transparent",
    color: "rgba(255,255,255,0.82)",
    border: "none",
    cursor: "pointer",
    fontSize: "11px",
    letterSpacing: "0.25em",
    textTransform: "uppercase"
  },
  hero: {
    minHeight: "78vh",
    display: "flex",
    alignItems: "center"
  },
  heroInner: {
    maxWidth: "1280px",
    margin: "0 auto",
    padding: "70px 24px 90px"
  },
  kicker: {
    margin: 0,
    fontSize: "12px",
    letterSpacing: "0.35em",
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.48)"
  },
  heroTitle: {
    margin: "18px 0 0",
    maxWidth: "980px",
    fontSize: "clamp(48px, 8vw, 92px)",
    lineHeight: 0.98,
    fontWeight: 300,
    letterSpacing: "0.04em"
  },
  heroText: {
    marginTop: "28px",
    maxWidth: "560px",
    fontSize: "16px",
    lineHeight: 1.9,
    color: "rgba(255,255,255,0.64)"
  },
  productsSection: {
    maxWidth: "1280px",
    margin: "0 auto",
    padding: "0 24px 100px"
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: "20px",
    marginBottom: "28px"
  },
  sectionKicker: {
    margin: 0,
    fontSize: "12px",
    letterSpacing: "0.35em",
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.4)"
  },
  sectionTitle: {
    margin: "12px 0 0",
    fontSize: "30px",
    fontWeight: 300,
    letterSpacing: "0.16em"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "28px"
  },
  card: {
    background: "#0a0a0a",
    borderRadius: "24px",
    overflow: "hidden",
    border: "1px solid rgba(255,255,255,0.08)"
  },
  imageWrap: {
    position: "relative",
    overflow: "hidden"
  },
  productImage: {
    width: "100%",
    height: "500px",
    objectFit: "cover",
    display: "block",
    opacity: 0.9,
    transform: "scale(1)",
    transition: "all 0.45s ease"
  },
  hoverAddButton: {
    position: "absolute",
    bottom: "18px",
    left: "50%",
    transform: "translateX(-50%)",
    background: "#ffffff",
    color: "#000000",
    border: "none",
    padding: "13px 22px",
    fontSize: "11px",
    letterSpacing: "0.3em",
    textTransform: "uppercase",
    cursor: "pointer",
    opacity: 0,
    transition: "opacity 0.3s ease"
  },
  cardFooter: {
    padding: "22px 22px 24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px"
  },
  productName: {
    margin: 0,
    fontSize: "13px",
    letterSpacing: "0.16em",
    fontWeight: 400
  },
  productPrice: {
    margin: 0,
    fontSize: "13px",
    color: "rgba(255,255,255,0.56)"
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
    maxWidth: "420px",
    height: "100%",
    background: "#000000",
    borderLeft: "1px solid rgba(255,255,255,0.08)",
    padding: "24px",
    display: "flex",
    flexDirection: "column"
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "26px"
  },
  drawerTitle: {
    margin: 0,
    fontSize: "18px",
    letterSpacing: "0.3em",
    fontWeight: 400
  },
  iconButton: {
    background: "transparent",
    color: "#ffffff",
    border: "none",
    cursor: "pointer"
  },
  drawerBody: {
    flex: 1,
    overflowY: "auto"
  },
  emptyText: {
    color: "rgba(255,255,255,0.45)",
    fontSize: "14px"
  },
  cartItem: {
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    paddingBottom: "18px",
    marginBottom: "18px"
  },
  cartTopRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: "14px",
    marginBottom: "12px"
  },
  cartItemName: {
    margin: 0,
    fontSize: "13px",
    letterSpacing: "0.15em"
  },
  cartItemMeta: {
    margin: "6px 0 0",
    fontSize: "12px",
    color: "rgba(255,255,255,0.5)"
  },
  cartLineTotal: {
    margin: 0,
    fontSize: "13px"
  },
  qtyRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px"
  },
  qtyButton: {
    width: "32px",
    height: "32px",
    border: "1px solid rgba(255,255,255,0.14)",
    background: "transparent",
    color: "#ffffff",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  qtyText: {
    minWidth: "22px",
    textAlign: "center",
    fontSize: "14px"
  },
  drawerFooter: {
    borderTop: "1px solid rgba(255,255,255,0.08)",
    paddingTop: "18px"
  },
  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "18px"
  },
  totalLabel: {
    fontSize: "12px",
    letterSpacing: "0.18em",
    color: "rgba(255,255,255,0.58)"
  },
  totalValue: {
    fontSize: "14px"
  },
  checkoutButton: {
    width: "100%",
    background: "#ffffff",
    color: "#000000",
    border: "none",
    padding: "16px",
    fontSize: "11px",
    letterSpacing: "0.3em",
    textTransform: "uppercase"
  },
  footer: {
    borderTop: "1px solid rgba(255,255,255,0.08)",
    padding: "28px 16px",
    textAlign: "center",
    fontSize: "11px",
    letterSpacing: "0.3em",
    color: "rgba(255,255,255,0.42)"
  }
};
