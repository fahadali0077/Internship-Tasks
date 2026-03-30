"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import {
  CART_COOKIE,
  getSessionCart,
  setSessionCart,
  clearSessionCart,
  addItemToCart,
  removeItemFromCart,
  updateItemQtyInCart,
} from "@/lib/session";
import { fetchProductById } from "@/lib/products";

// ── Action result type ────────────────────────────────────────────────────────
export interface ActionResult {
  success: boolean;
  message: string;
  cartCount?: number;
}

// ── loginAction ───────────────────────────────────────────────────────────────
/**
 * loginAction — mock auth that sets the session cookie.
 *
 * CRITICAL FIX: Must set CART_COOKIE ("mern_cart"), NOT a separate "session"
 * cookie. The middleware in middleware.ts checks for CART_COOKIE to decide
 * whether to allow access to /cart. If loginAction sets a different cookie
 * name, the middleware never sees it and keeps redirecting to /auth/login
 * even after a successful login — an infinite redirect loop.
 *
 * MENTAL MODEL:
 *   middleware.ts:  checks request.cookies.get(CART_COOKIE)
 *   loginAction:    must set CART_COOKIE  ← same name, same cookie
 *
 * MERN-IV swap: replace with NextAuth.js signIn() which issues a proper
 * JWT session token that middleware verifies via getToken({ req }).
 */
export async function loginAction(
  email: string,
  password: string,
): Promise<ActionResult> {
  try {
    if (!email || password.length < 8) {
      return { success: false, message: "Invalid credentials" };
    }

    const cookieStore = await cookies();

    // Set the CART_COOKIE so the middleware grants access to /cart.
    // We initialise it with an empty cart — the user's real cart will
    // populate as they add items via addToCart().
    cookieStore.set(CART_COOKIE, JSON.stringify([]), {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      secure: process.env.NODE_ENV === "production",
    });

    return { success: true, message: "Logged in" };
  } catch (error) {
    console.error("[loginAction]", error);
    return { success: false, message: "Login failed" };
  }
}

// ── addToCart ─────────────────────────────────────────────────────────────────
export async function addToCart(productId: string, qty = 1): Promise<ActionResult> {
  try {
    const product = await fetchProductById(productId);
    if (!product) {
      return { success: false, message: `Product "${productId}" not found` };
    }

    const cart    = await getSessionCart();
    const updated = addItemToCart(cart, product, qty);
    await setSessionCart(updated);
    revalidatePath("/cart");

    const cartCount = updated.reduce((sum, i) => sum + i.qty, 0);
    return { success: true, message: `${product.name} added to cart`, cartCount };
  } catch (error) {
    console.error("[addToCart]", error);
    return { success: false, message: "Failed to add item to cart" };
  }
}

// ── removeFromCart ────────────────────────────────────────────────────────────
export async function removeFromCart(productId: string): Promise<ActionResult> {
  try {
    const cart    = await getSessionCart();
    const updated = removeItemFromCart(cart, productId);
    await setSessionCart(updated);
    revalidatePath("/cart");

    const cartCount = updated.reduce((sum, i) => sum + i.qty, 0);
    return { success: true, message: "Item removed from cart", cartCount };
  } catch (error) {
    console.error("[removeFromCart]", error);
    return { success: false, message: "Failed to remove item" };
  }
}

// ── updateCartQty ─────────────────────────────────────────────────────────────
export async function updateCartQty(
  productId: string,
  qty: number,
): Promise<ActionResult> {
  try {
    const cart    = await getSessionCart();
    const updated = updateItemQtyInCart(cart, productId, qty);
    await setSessionCart(updated);
    revalidatePath("/cart");

    const cartCount = updated.reduce((sum, i) => sum + i.qty, 0);
    return { success: true, message: "Cart updated", cartCount };
  } catch (error) {
    console.error("[updateCartQty]", error);
    return { success: false, message: "Failed to update quantity" };
  }
}

// ── clearCart ─────────────────────────────────────────────────────────────────
export async function clearCart(): Promise<ActionResult> {
  try {
    await clearSessionCart();
    revalidatePath("/cart");
    return { success: true, message: "Cart cleared", cartCount: 0 };
  } catch (error) {
    console.error("[clearCart]", error);
    return { success: false, message: "Failed to clear cart" };
  }
}
