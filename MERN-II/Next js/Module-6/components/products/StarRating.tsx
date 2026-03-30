interface StarRatingProps {
  rating: number;
  reviewCount: number;
}

export function StarRating({ rating, reviewCount }: StarRatingProps) {
  const stars = Array.from({ length: 5 }, (_, i) => {
    if (rating >= i + 1) return "full";
    if (rating >= i + 0.5) return "half";
    return "empty";
  });

  return (
    <div className="flex items-center gap-1.5">
      <span className="flex" aria-label={`${rating} out of 5`}>
        {stars.map((type, i) => (
          <span
            key={i}
            className={`text-base leading-none ${type === "empty" ? "text-border" : "text-amber-light"}`}
            aria-hidden="true"
          >
            {type === "full" ? "★" : type === "half" ? "⯨" : "☆"}
          </span>
        ))}
      </span>
      <span className="text-xs text-ink-muted">({reviewCount.toLocaleString()})</span>
    </div>
  );
}
