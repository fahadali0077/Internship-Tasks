import { useWishlistStore } from "@/stores/wishlistStore";
import type { Product } from "@/types";

interface WishlistButtonProps {
  product: Product;
}

/**
 * WishlistButton — icon button that toggles a product in/out of the wishlist.
 *
 * SELECTOR PATTERN:
 *   We derive `isWishlisted` by calling the store's selector method.
 *   The component re-renders only when the wishlist items array changes
 *   (because isWishlisted reads from items). This is fine at our scale.
 *   For a very large wishlist you'd memoize the selector.
 */
export function WishlistButton({ product }: WishlistButtonProps) {
  const toggle = useWishlistStore((s) => s.toggle);
  const isWishlisted = useWishlistStore((s) => s.isWishlisted(product.id));

  return (
    <button
      className={`wishlist-btn ${isWishlisted ? "wishlist-btn--active" : ""}`}
      onClick={(e) => {
        e.stopPropagation(); // prevent card click bubbling
        toggle(product);
      }}
      aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
      aria-pressed={isWishlisted}
    >
      {isWishlisted ? "♥" : "♡"}
    </button>
  );
}
