"use server";

import { revalidatePath } from "next/cache";
import { fetchProductById } from "@/lib/products";
import {
  getSessionCart,
  setSessionCart,
  clearSessionCart,
  addItemToCart,
  removeItemFromCart,
  updateItemQtyInCart,
} from "@/lib/session";

// ── loginAction ───────────────────────────────────────────────────────────────
export async function loginAction(
  email: string,
  password: string,
): Promise<ActionResult> {
  try {
    if (!email || password.length < 8) {
      return { success: false, message: "Invalid credentials" };
    }

    // Set a session cookie to mark user as logged in
    const { cookies } = await import("next/headers");
    (await cookies()).set("session", Buffer.from(email).toString("base64"), {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return { success: true, message: "Logged in" };
  } catch (error) {
    console.error("[loginAction]", error);
    return { success: false, message: "Login failed" };
  }
}

// ── Action result type ────────────────────────────────────────────────────────
export interface ActionResult {
  success: boolean;
  message: string;
  cartCount?: number;
}

// ── addToCart ─────────────────────────────────────────────────────────────────

export async function addToCart(productId: string, qty = 1): Promise<ActionResult> {
  try {
    const product = await fetchProductById(productId);
    if (!product) {
      return { success: false, message: `Product "${productId}" not found` };
    }

    const cart = await getSessionCart();
    const updated = addItemToCart(cart, product, qty);
    await setSessionCart(updated);

    // Purge /cart page cache so the Server Component reads the fresh cookie
    revalidatePath("/cart");

    const cartCount = updated.reduce((sum, i) => sum + i.qty, 0);
    return {
      success: true,
      message: `${product.name} added to cart`,
      cartCount,
    };
  } catch (error) {
    console.error("[addToCart]", error);
    return { success: false, message: "Failed to add item to cart" };
  }
}

// ── removeFromCart ────────────────────────────────────────────────────────────
export async function removeFromCart(productId: string): Promise<ActionResult> {
  try {
    const cart = await getSessionCart();
    const updated = removeItemFromCart(cart, productId);
    await setSessionCart(updated);

    // REQUIRED: purge the /cart page cache after mutation
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
    const cart = await getSessionCart();
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
