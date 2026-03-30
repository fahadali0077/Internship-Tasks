import { Link, useLocation } from "react-router-dom";

/**
 * NotFoundPage — path="*" catch-all.
 *
 * HOW TO TEST:
 *   Type any nonsense URL in the browser: /foo, /bar/baz, /products/fake-id
 *   (Note: /products/fake-id hits ProductDetailPage which has its own 404 state —
 *    the catch-all only fires for routes with NO matching path at all)
 *
 * useLocation().pathname shows EXACTLY which URL the user tried to visit.
 */
export function NotFoundPage() {
  const { pathname } = useLocation();

  return (
    <div className="nf-page">
      <p className="nf-code">404</p>
      <h1 className="nf-title">Page not found</h1>
      <p className="nf-path">
        <code>{pathname}</code>
      </p>
      <p className="nf-sub">
        This route doesn't exist in the router. The catch-all{" "}
        <code>path="*"</code> matched it.
      </p>
      <div className="nf-actions">
        <Link to="/" className="btn-primary">Go home</Link>
        <Link to="/products" className="btn-ghost">Browse products</Link>
      </div>
    </div>
  );
}
