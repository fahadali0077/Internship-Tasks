import { Navigate } from "react-router-dom";
import { RegisterForm } from "@/components/RegisterForm";
import { useAuthStore } from "@/stores/authStore";

/**
 * RegisterPage — "/register"
 *
 * Wraps the RegisterForm component (built in Module 3.5) inside a full page.
 * Redirects already-authenticated users to /products immediately.
 *
 * PDF task requirement:
 *   "This Register form becomes the /auth/register page in the capstone"
 *   For this Vite SPA the route is /register; in Module 4 (Next.js App Router)
 *   it will move to /auth/register via a route group.
 *
 * NAVIGATION:
 *   onSuccess       → navigate to /login so the user can sign in
 *   onSwitchToLogin → same (user clicked "Already have an account?")
 */
export function RegisterPage() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  // Already logged in — no point registering again
  if (isAuthenticated) {
    return <Navigate to="/products" replace />;
  }

  return (
    <div className="auth-page">
      <RegisterForm
        onSuccess={() => {
          // In Module 6 this navigates after a real Server Action succeeds.
          // For now the form shows its own success state — no navigation needed.
        }}
        onSwitchToLogin={() => {
          window.location.href = "/login";
        }}
      />
    </div>
  );
}
