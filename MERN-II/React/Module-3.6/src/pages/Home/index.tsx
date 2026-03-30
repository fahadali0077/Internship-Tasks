import { Link } from "react-router-dom";
import { useProducts } from "@/hooks/useProducts";

/**
 * HomePage — "/"
 * Hero section + quick stats + CTA to /products.
 */
export function HomePage() {
  const { data } = useProducts();
  const totalProducts = data?.length ?? 0;

  return (
    <div className="home-page">
      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-content">
          <p className="hero-tag">Module 3.6 — Multi-Page SPA with React Router </p>
          <h1 className="hero-title">
            The Modern <br />
            <span className="title-accent">Frontend Store</span>
          </h1>
          <p className="hero-sub">
            A production-grade SPA built with React 19, TypeScript, Zustand,
            and TanStack Query — migrating to Next.js 15 in Module 4.
          </p>
          <div className="hero-ctas">
            <Link to="/products" className="btn-primary">
              Browse Products →
            </Link>
            <Link to="/login" className="btn-ghost">
              Sign In
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="hero-stats">
          {[
            { label: "Products", value: totalProducts || "12" },
            { label: "Categories", value: "5" },
            { label: "React version", value: "19" },

          ].map((s) => (
            <div key={s.label} className="stat-card">
              <span className="stat-value">{s.value}</span>
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </section>


    </div>
  );
}
