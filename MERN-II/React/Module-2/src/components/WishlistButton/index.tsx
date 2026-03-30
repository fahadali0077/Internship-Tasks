import { useWishlistStore } from "@/stores/wishlistStore";
import type { Product } from "@/types";

interface WishlistButtonProps {
  product: Product;
}


export function WishlistButton({ product }: WishlistButtonProps) {
  const isWishlisted = useWishlistStore((s) => s.isWishlisted(product.id));
  const toggle = useWishlistStore((s) => s.toggle);

  return (
    <button
      className={`wishlist-btn ${isWishlisted ? "wishlist-btn--active" : ""}`}
      onClick={(e) => {
        e.stopPropagation(); // prevent card click through
        toggle(product);
      }}
      aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
      aria-pressed={isWishlisted}
      title={isWishlisted ? "Remove from wishlist" : "Save to wishlist"}
    >
      <svg
        viewBox="0 0 24 24"
        width="18"
        height="18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={isWishlisted ? "currentColor" : "none"}
        aria-hidden="true"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </button>
  );
}
