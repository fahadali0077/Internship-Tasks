import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";

interface ProtectedRouteProps {
  children: ReactNode;
}

/**
 * ProtectedRoute — auth guard.
 *
 * HOW TO TEST:
 *   1. Make sure you are logged out (click "Log out" in the navbar)
 *   2. Navigate to /cart directly in the browser address bar
 *   3. You should be immediately redirected to /login
 *   4. The URL in the login form subtitle will show "continue to /cart"
 *   5. Enter any email + password → you land on /cart
 *
 * MENTAL MODEL — Navigate with replace + state:
 *   replace: true  → the /cart entry is REPLACED by /login in history.
 *                    Pressing Back won't loop: /login → /cart → /login.
 *   state.from     → stores the Location object of where the user was
 *                    trying to go. LoginPage reads this to redirect back.
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  return <>{children}</>;
}
