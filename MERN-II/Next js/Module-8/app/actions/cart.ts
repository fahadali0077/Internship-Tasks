"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { fetchProductById } from "@/lib/products";
import {
  CART_COOKIE,
  getSessionCart,
  setSessionCart,
  clearSessionCart,
  addItemToCart,
  removeItemFromCart,
  updateItemQtyInCart,
} from "@/lib/session";
import { AddToCartInputSchema, UpdateQtyInputSchema } from "@/schemas";
import type { ActionResult } from "@/types";

// ── loginAction ───────────────────────────────────────────────────────────────
/**
 * loginAction — mock auth that sets the session cookie.
 *
 * CRITICAL: Must set CART_COOKIE ("mern_cart"), NOT a cookie named "session".
 *
 * middleware.ts checks:   request.cookies.get(CART_COOKIE)  ← "mern_cart"
 * loginAction must set:   CART_COOKIE                       ← "mern_cart"
 *
 * If loginAction sets a cookie with a DIFFERENT name ("session"), the
 * middleware never sees it → keeps redirecting to /auth/login even after
 * a successful login → infinite redirect loop that breaks the entire auth flow.
 *
 * Module 8 is also the right time to use the CART_COOKIE constant (imported
 * from lib/session.ts) rather than a hardcoded string. This is exactly the
 * type of implicit coupling that Zod + t3-env is designed to surface.
 *
 * MERN-IV swap: replace with NextAuth.js signIn() + JWT session token.
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

    // Set CART_COOKIE so the middleware grants access to /cart, /checkout, /account.
    // Initialise with an empty cart — items populate via addToCart().
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
export async function addToCart(productId: string, qty = 1): Promise<ActionResult<number>> {
  const parsed = AddToCartInputSchema.safeParse({ productId, qty });
  if (!parsed.success) {
    return {
      success: false,
      message: "Invalid input",
      fieldErrors: parsed.error.flatten().fieldErrors as Partial<Record<string, string[]>>,
    };
  }

  try {
    const product = await fetchProductById(parsed.data.productId);
    if (!product) {
      return { success: false, message: `Product "${parsed.data.productId}" not found` };
    }

    const cart    = await getSessionCart();
    const updated = addItemToCart(cart, product, parsed.data.qty);
    await setSessionCart(updated);
    revalidatePath("/cart");

    const cartCount = updated.reduce((sum, i) => sum + i.qty, 0);
    return { success: true, message: `${product.name} added to cart`, data: cartCount };
  } catch (error) {
    console.error("[addToCart]", error);
    return { success: false, message: "Failed to add item to cart" };
  }
}

// ── removeFromCart ────────────────────────────────────────────────────────────
export async function removeFromCart(productId: string): Promise<ActionResult<number>> {
  const parsed = AddToCartInputSchema.pick({ productId: true }).safeParse({ productId });
  if (!parsed.success) {
    return { success: false, message: "Invalid product ID" };
  }

  try {
    const cart    = await getSessionCart();
    const updated = removeItemFromCart(cart, parsed.data.productId);
    await setSessionCart(updated);
    revalidatePath("/cart");

    const cartCount = updated.reduce((sum, i) => sum + i.qty, 0);
    return { success: true, message: "Item removed from cart", data: cartCount };
  } catch (error) {
    console.error("[removeFromCart]", error);
    return { success: false, message: "Failed to remove item" };
  }
}

// ── updateCartQty ─────────────────────────────────────────────────────────────
export async function updateCartQty(
  productId: string,
  qty: number,
): Promise<ActionResult<number>> {
  const parsed = UpdateQtyInputSchema.safeParse({ productId, qty });
  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Invalid input",
      fieldErrors: parsed.error.flatten().fieldErrors as Partial<Record<string, string[]>>,
    };
  }

  try {
    const cart    = await getSessionCart();
    const updated = updateItemQtyInCart(cart, parsed.data.productId, parsed.data.qty);
    await setSessionCart(updated);
    revalidatePath("/cart");

    const cartCount = updated.reduce((sum, i) => sum + i.qty, 0);
    return { success: true, message: "Cart updated", data: cartCount };
  } catch (error) {
    console.error("[updateCartQty]", error);
    return { success: false, message: "Failed to update quantity" };
  }
}

// ── clearCart ─────────────────────────────────────────────────────────────────
export async function clearCart(): Promise<ActionResult<number>> {
  try {
    await clearSessionCart();
    revalidatePath("/cart");
    return { success: true, message: "Cart cleared", data: 0 };
  } catch (error) {
    console.error("[clearCart]", error);
    return { success: false, message: "Failed to clear cart" };
  }
}
