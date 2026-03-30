import { useWishlistStore } from "@/stores/wishlistStore";
import type { Product } from "@/types";

interface WishlistButtonProps {
  product: Product;
}

export function WishlistButton({ product }: WishlistButtonProps) {
  const toggle = useWishlistStore((s) => s.toggle);
  const isWishlisted = useWishlistStore((s) => s.isWishlisted(product.id));

  return (
    <button
      className={`wishlist-btn ${isWishlisted ? "wishlist-btn--active" : ""}`}
      onClick={(e) => {
        e.stopPropagation();
        toggle(product);
      }}
      aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
      aria-pressed={isWishlisted}
    >
      {isWishlisted ? "♥" : "♡"}
    </button>
  );
}
