interface StarRatingProps {
  rating: number;      // 0–5, one decimal place
  reviewCount: number;
}
export function StarRating({ rating, reviewCount }: StarRatingProps) {
  const stars = Array.from({ length: 5 }, (_, i) => {
    if (rating >= i + 1) return "full";
    if (rating >= i + 0.5) return "half";
    return "empty";
  });

  return (
    <div className="star-rating">
      <span className="stars" aria-label={`Rating: ${rating} out of 5`} role="img">
        {stars.map((type, i) => {
          if (type === "half") {
            return (
              <span key={i} className="star star--half" aria-hidden="true">
                <span className="star-base">☆</span>
                <span className="star-fill">★</span>
              </span>
            );
          }
          return (
            <span key={i} className={`star star--${type}`} aria-hidden="true">
              {type === "full" ? "★" : "☆"}
            </span>
          );
        })}
      </span>
      <span className="review-count">
        ({reviewCount.toLocaleString()})
      </span>
    </div>
  );
}
