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
        <meta
          name="description"
          content="Dark luxury streetwear with a gothic edge."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div style={styles.page}>
        <header style={styles.header}>
          <div style={styles.headerInner}>
            <div style={styles.logoWrap}>
              <div style={styles.logoMark}>✦</div>
              <div style={styles.logo}>NØIR</div>
            </div>

            <nav style={styles.nav}>
              <a href="#shop" style={styles.navLink}>SHOP</a>
              <a href="#story" style={styles.navLink}>STORY</a>
              <a href="#contact" style={styles.navLink}>CONTACT</a>
            </nav>

            <button style={styles.cartButton} onClick={() => setOpenCart(true)}>
              <ShoppingBag size={16} />
              <span>CART ({itemCount})</span>
            </button>
          </div>
        </header>

        <main>
          <section style={styles.hero}>
            <div style={styles.heroOverlay} />
            <div style={styles.heroInner}>
              <p style={styles.kicker}>ONLINE EXCLUSIVE</p>
              <h1 style={styles.heroTitle}>
                Dark luxury.
                <br />
                Gothic edge.
              </h1>
              <p style={styles.heroText}>
                NØIR blends monochrome tailoring, streetwear silhouettes, and a
                sharper rock-inspired attitude into a digital-first label.
              </p>

              <div style={styles.heroButtons}>
                <a href="#shop" style={styles.primaryButton}>
                  SHOP DROP 01
                </a>
                <a href="#story" style={styles.secondaryButton}>
                  BRAND STORY
                </a>
              </div>
            </div>
          </section>

          <section id="shop" style={styles.productsSection}>
            <div style={styles.sectionHeader}>
              <div>
                <p style={styles.sectionKicker}>DROP 01</p>
                <h2 style={styles.sectionTitle}>Featured Pieces</h2>
              </div>
              <div style={styles.ruleWrap}>
                <span style={styles.rule}></span>
                <span style={styles.ruleIcon}>✦</span>
                <span style={styles.rule}></span>
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
                      img.style.transform = "scale(1.035)";
                      img.style.filter = "grayscale(0%) contrast(1.05)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    const btn = e.currentTarget.querySelector(".hoverButton");
                    if (btn) btn.style.opacity = "0";
                    const img = e.currentTarget.querySelector(".productImage");
                    if (img) {
                      img.style.transform = "scale(1)";
                      img.style.filter = "grayscale(12%) contrast(1)";
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
                    <div style={styles.imageShade} />
                    <button
                      className="hoverButton"
                      style={styles.hoverAddButton}
                      onClick={() => addToCart(product)}
                    >
                      ADD TO CART
                    </button>
                  </div>

                  <div style={styles.cardFooter}>
                    <div>
                      <h3 style={styles.productName}>{product.name}</h3>
                      <p style={styles.productSub}>BLACK LABEL ESSENTIAL</p>
                    </div>
                    <p style={styles.productPrice}>${product.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section id="story" style={styles.storySection}>
            <div style={styles.storyRuleWrap}>
              <span style={styles.rule}></span>
              <span style={styles.ruleIcon}>✦</span>
              <span style={styles.rule}></span>
            </div>

            <p style={styles.storyEyebrow}>NØIR WORLD</p>
            <h2 style={styles.storyTitle}>
              Built for a darker,
              <br />
              more elevated uniform.
            </h2>
            <p style={styles.storyText}>
              Designed around black, silver, washed neutrals, and strong
              silhouettes, NØIR is meant to feel sharp, rare, and understated.
            </p>
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

        <footer id="contact" style={styles.footer}>
          <div style={styles.footerTop}>
            <div style={styles.footerBrand}>NØIR</div>
            <div style={styles.footerLinks}>
              <span>ONLINE EXCLUSIVE</span>
              <span>WORLDWIDE SHIPPING</span>
              <span>CONTACT@NOIR.COM</span>
            </div>
          </div>
          <div style={styles.footerBottom}>© 2026 NØIR</div>
        </footer>
      </div>
    </>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    color: "#fff",
    background:
      "radial-gradient(circle at top, rgba(70,70,70,0.12) 0%, rgba(0,0,0,0) 28%), linear-gradient(to bottom, #020202 0%, #000000 55%, #040404 100%)",
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  },
  header: {
    position: "sticky",
    top: 0,
    zIndex: 50,
    background: "rgba(0,0,0,0.76)",
    backdropFilter: "blur(12px)",
    borderBottom: "1px solid rgba(255,255,255,0.08)"
  },
  headerInner: {
    maxWidth: "1320px",
    margin: "0 auto",
    padding: "18px 24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "16px",
    flexWrap: "wrap"
  },
  logoWrap: {
    display: "flex",
    alignItems: "center",
    gap: "12px"
  },
  logoMark: {
    fontSize: "14px",
    color: "rgba(255,255,255,0.75)"
  },
  logo: {
    fontFamily: 'Georgia, "Times New Roman", serif',
    fontSize: "28px",
    letterSpacing: "0.2em",
    fontWeight: 700
  },
  nav: {
    display: "flex",
    alignItems: "center",
    gap: "26px"
  },
  navLink: {
    color: "rgba(255,255,255,0.72)",
    textDecoration: "none",
    fontSize: "11px",
    letterSpacing: "0.28em"
  },
  cartButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "transparent",
    color: "#fff",
    border: "1px solid rgba(255,255,255,0.16)",
    padding: "10px 14px",
    cursor: "pointer",
    fontSize: "11px",
    letterSpacing: "0.22em"
  },
  hero: {
    position: "relative",
    minHeight: "86vh",
    display: "flex",
    alignItems: "center",
    overflow: "hidden"
  },
  heroOverlay: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(to bottom, rgba(0,0,0,0.25), rgba(0,0,0,0.72)), url('https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1600&q=80') center/cover no-repeat",
    opacity: 0.26
  },
  heroInner: {
    position: "relative",
    zIndex: 2,
    maxWidth: "1320px",
    margin: "0 auto",
    padding: "80px 24px 100px"
  },
  kicker: {
    margin: 0,
    fontSize: "12px",
    letterSpacing: "0.38em",
    color: "rgba(255,255,255,0.56)"
  },
  heroTitle: {
    margin: "22px 0 0",
    fontFamily: 'Georgia, "Times New Roman", serif',
    fontSize: "clamp(54px, 8vw, 106px)",
    lineHeight: 0.92,
    letterSpacing: "0.04em",
    fontWeight: 700,
    textTransform: "uppercase",
    textShadow: "0 8px 30px rgba(0,0,0,0.45)"
  },
  heroText: {
    marginTop: "28px",
    maxWidth: "620px",
    fontSize: "16px",
    lineHeight: 1.9,
    color: "rgba(255,255,255,0.72)"
  },
  heroButtons: {
    display: "flex",
    gap: "14px",
    marginTop: "34px",
    flexWrap: "wrap"
  },
  primaryButton: {
    background: "#efefef",
    color: "#000",
    textDecoration: "none",
    padding: "15px 22px",
    fontSize: "11px",
    letterSpacing: "0.28em"
  },
  secondaryButton: {
    background: "transparent",
    color: "#fff",
    textDecoration: "none",
    border: "1px solid rgba(255,255,255,0.18)",
    padding: "15px 22px",
    fontSize: "11px",
    letterSpacing: "0.28em"
  },
  productsSection: {
    maxWidth: "1320px",
    margin: "0 auto",
    padding: "0 24px 110px"
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: "20px",
    marginBottom: "28px",
    flexWrap: "wrap"
  },
  sectionKicker: {
    margin: 0,
    fontSize: "12px",
    letterSpacing: "0.38em",
    color: "rgba(255,255,255,0.44)"
  },
  sectionTitle: {
    margin: "12px 0 0",
    fontFamily: 'Georgia, "Times New Roman", serif',
    fontSize: "34px",
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase"
  },
  ruleWrap: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    minWidth: "220px"
  },
  rule: {
    flex: 1,
    height: "1px",
    background: "rgba(255,255,255,0.16)"
  },
  ruleIcon: {
    fontSize: "14px",
    color: "rgba(255,255,255,0.8)"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))",
    gap: "28px"
  },
  card: {
    background: "linear-gradient(to bottom, #0a0a0a, #050505)",
    border: "1px solid rgba(255,255,255,0.08)",
    overflow: "hidden",
    boxShadow: "0 10px 30px rgba(0,0,0,0.28)"
  },
  imageWrap: {
    position: "relative",
    overflow: "hidden"
  },
  imageShade: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(to bottom, rgba(0,0,0,0.02), rgba(0,0,0,0.22), rgba(0,0,0,0.42))"
  },
  productImage: {
    width: "100%",
    height: "560px",
    objectFit: "cover",
    display: "block",
    filter: "grayscale(12%) contrast(1)",
    transform: "scale(1)",
    transition: "all 0.45s ease"
  },
  hoverAddButton: {
    position: "absolute",
    bottom: "20px",
    left: "50%",
    transform: "translateX(-50%)",
    background: "#ffffff",
    color: "#000",
    border: "none",
    padding: "13px 22px",
    fontSize: "11px",
    letterSpacing: "0.28em",
    opacity: 0,
    transition: "opacity 0.3s ease",
    cursor: "pointer",
    zIndex: 2
  },
  cardFooter: {
    padding: "22px 22px 24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "12px"
  },
  productName: {
    margin: 0,
    fontFamily: 'Georgia, "Times New Roman", serif',
    fontSize: "20px",
    fontWeight: 700,
    letterSpacing: "0.05em",
    textTransform: "uppercase"
  },
  productSub: {
    margin: "8px 0 0",
    fontSize: "11px",
    letterSpacing: "0.2em",
    color: "rgba(255,255,255,0.42)"
  },
  productPrice: {
    margin: 0,
    fontSize: "14px",
    color: "rgba(255,255,255,0.78)"
  },
  storySection: {
    maxWidth: "920px",
    margin: "0 auto",
    padding: "0 24px 120px",
    textAlign: "center"
  },
  storyRuleWrap: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "22px"
  },
  storyEyebrow: {
    margin: 0,
    fontSize: "12px",
    letterSpacing: "0.38em",
    color: "rgba(255,255,255,0.45)"
  },
  storyTitle: {
    margin: "20px 0 0",
    fontFamily: 'Georgia, "Times New Roman", serif',
    fontSize: "clamp(34px, 5vw, 58px)",
    lineHeight: 1.02,
    textTransform: "uppercase",
    letterSpacing: "0.06em"
  },
  storyText: {
    maxWidth: "700px",
    margin: "24px auto 0",
    fontSize: "16px",
    lineHeight: 1.9,
    color: "rgba(255,255,255,0.66)"
  },
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.76)",
    display: "flex",
    justifyContent: "flex-end",
    zIndex: 100
  },
  drawer: {
    width: "100%",
    maxWidth: "430px",
    height: "100%",
    background: "#030303",
    borderLeft: "1px solid rgba(255,255,255,0.1)",
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
    fontFamily: 'Georgia, "Times New Roman", serif',
    fontSize: "24px",
    letterSpacing: "0.08em",
    textTransform: "uppercase"
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
    letterSpacing: "0.15em",
    textTransform: "uppercase"
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
    fontSize: "15px"
  },
  checkoutButton: {
    width: "100%",
    background: "#f2f2f2",
    color: "#000000",
    border: "none",
    padding: "16px",
    fontSize: "11px",
    letterSpacing: "0.3em",
    textTransform: "uppercase"
  },
  footer: {
    borderTop: "1px solid rgba(255,255,255,0.08)",
    padding: "34px 24px"
  },
  footerTop: {
    maxWidth: "1320px",
    margin: "0 auto",
    display: "flex",
    justifyContent: "space-between",
    gap: "20px",
    flexWrap: "wrap",
    alignItems: "center"
  },
  footerBrand: {
    fontFamily: 'Georgia, "Times New Roman", serif',
    fontSize: "24px",
    letterSpacing: "0.18em",
    textTransform: "uppercase"
  },
  footerLinks: {
    display: "flex",
    gap: "18px",
    flexWrap: "wrap",
    color: "rgba(255,255,255,0.55)",
    fontSize: "11px",
    letterSpacing: "0.18em"
  },
  footerBottom: {
    maxWidth: "1320px",
    margin: "20px auto 0",
    color: "rgba(255,255,255,0.35)",
    fontSize: "11px",
    letterSpacing: "0.2em"
  }
};
