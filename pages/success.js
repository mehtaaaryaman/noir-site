import Link from "next/link";
import Head from "next/head";

export default function Success() {
  return (
    <>
      <Head>
        <title>Order Confirmed — NØIR</title>
      </Head>
      <div
        style={{
          minHeight: "100vh",
          background: "#000",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
          fontFamily: "Inter, Arial, sans-serif"
        }}
      >
        <div style={{ maxWidth: 560, textAlign: "center" }}>
          <p style={{ letterSpacing: "0.35em", fontSize: 12, opacity: 0.5 }}>
            NØIR
          </p>
          <h1
            style={{
              fontSize: 42,
              fontWeight: 300,
              letterSpacing: "0.08em",
              marginTop: 18
            }}
          >
            Order Confirmed
          </h1>
          <p
            style={{
              marginTop: 18,
              color: "rgba(255,255,255,0.65)",
              lineHeight: 1.8
            }}
          >
            Thank you for shopping with NØIR. A confirmation email will be sent
            after payment completes.
          </p>
          <Link
            href="/"
            style={{
              display: "inline-block",
              marginTop: 28,
              background: "#fff",
              color: "#000",
              padding: "14px 22px",
              textDecoration: "none",
              letterSpacing: "0.2em",
              fontSize: 12
            }}
          >
            RETURN HOME
          </Link>
        </div>
      </div>
    </>
  );
}
