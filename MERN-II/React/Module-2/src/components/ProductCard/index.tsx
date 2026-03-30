import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCartStore } from "@/stores/cartStore";
import { addToCartApi } from "@/lib/api";
import { WishlistButton } from "@/components/WishlistButton";
import { StarRating } from "./StarRating";
import type { Product } from "@/types";

const BADGE_CLASS: Record<NonNullable<Product["badge"]>, string> = {
  New: "badge--new",
  Sale: "badge--sale",
  Hot: "badge--hot",
};

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { id, name, price, originalPrice, image, rating, reviewCount, badge } = product;

  const isInCart = useCartStore((s) => s.isInCart(id));
  const addItem = useCartStore((s) => s.addItem);
  const removeItem = useCartStore((s) => s.removeItem);
  const qc = useQueryClient();

  const cartMutation = useMutation({
    mutationFn: (productId: string) => addToCartApi(productId),
    onMutate: () => {
      if (isInCart) {
        removeItem(id);
      } else {
        addItem(product);
      }
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: () => {
      if (isInCart) {
        addItem(product);
      } else {
        removeItem(id);
      }
    },
  });

  const discount =
    originalPrice != null
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : null;

  return (
    <article className={`product-card ${isInCart ? "product-card--in-cart" : ""}`}>
      {badge && <span className={`badge ${BADGE_CLASS[badge]}`}>{badge}</span>}

      <div className="card-wishlist-wrap">
        <WishlistButton product={product} />
      </div>

      <div className="card-image-wrap">
        <img src={image} alt={name} className="card-image" loading="lazy" />
        {isInCart && <div className="cart-overlay" aria-hidden="true">✓ Added</div>}
      </div>

      <div className="card-body">
        <p className="card-category">{product.category}</p>
        <h2 className="card-name">{name}</h2>
        <StarRating rating={rating} reviewCount={reviewCount} />

        <div className="card-pricing">
          <span className="price-current">${price.toFixed(2)}</span>
          {originalPrice != null && (
            <>
              <span className="price-original">${originalPrice.toFixed(2)}</span>
              <span className="price-discount">−{discount ?? 0}%</span>
            </>
          )}
        </div>

        <button
          className={`btn-cart ${isInCart ? "btn-cart--added" : ""}`}
          onClick={() => { cartMutation.mutate(id); }}
          disabled={cartMutation.isPending}
          aria-pressed={isInCart}
          aria-label={isInCart ? `Remove ${name} from cart` : `Add ${name} to cart`}
        >
          {cartMutation.isPending ? "…" : isInCart ? "✓  Remove from Cart" : "+ Add to Cart"}
        </button>
      </div>
    </article>
  );
}
