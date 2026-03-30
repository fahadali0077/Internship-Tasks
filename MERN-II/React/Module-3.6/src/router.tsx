import { createBrowserRouter } from "react-router-dom";

import { RootLayout } from "@/components/Layout/RootLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";

import { HomePage } from "@/pages/Home";
import { ProductsPage } from "@/pages/Products";
import { ProductDetailPage } from "@/pages/ProductDetail";
import { CartPage } from "@/pages/Cart";
import { LoginPage } from "@/pages/Login";
import { RegisterPage } from "@/pages/Register";
import { NotFoundPage } from "@/pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,          // persistent shell — Navbar + Footer
    children: [
      { index: true, element: <HomePage /> },                          // "/"
      { path: "products", element: <ProductsPage /> },                 // "/products"
      { path: "products/:id", element: <ProductDetailPage /> },        // "/products/p-001"
      {
        path: "cart",
        element: (
          // ProtectedRoute checks isAuthenticated; redirects to /login if false
          <ProtectedRoute>
            <CartPage />
          </ProtectedRoute>
        ),
      },
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },                 // "/register"
      { path: "*", element: <NotFoundPage /> },                        // 404 catch-all
    ],
  },
]);
