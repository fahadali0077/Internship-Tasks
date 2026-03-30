import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";

interface AuthState {
  isAuthenticated: boolean;
  user: { name: string; email: string } | null;

  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

/**
 * authStore — mock authentication state.
 *
 * MENTAL MODEL — why persist here?
 *   isAuthenticated must survive page refresh, otherwise the user gets
 *   logged out every time they navigate to a new URL directly. We persist
 *   only the data fields (not the action functions) via `partialize`.
 *
 *   In Module 6 (NextAuth.js) this entire store is replaced by server-side
 *   session cookies read in Next.js middleware. For now, localStorage is
 *   the right mock.
 *
 * PROTECTED ROUTE CONTRACT:
 *   Any component can call useAuthStore(s => s.isAuthenticated) to know
 *   if the user is logged in. ProtectedRoute uses this to redirect to /login.
 */
export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        isAuthenticated: false,
        user: null,

        login: async (email, _password) => {
          // Simulate a 600ms API call
          await new Promise((res) => setTimeout(res, 600));

          // Mock: any email/password combination succeeds
          // In Module 6 this becomes a real NextAuth signIn() call
          set(
            {
              isAuthenticated: true,
              user: {
                name: email.split("@")[0] ?? "User",
                email,
              },
            },
            false,
            "auth/login",
          );
        },

        logout: () => {
          set({ isAuthenticated: false, user: null }, false, "auth/logout");
        },
      }),
      {
        name: "mern-ii-auth",
        partialize: (s) => ({ isAuthenticated: s.isAuthenticated, user: s.user }),
      },
    ),
    { name: "AuthStore" },
  ),
);
