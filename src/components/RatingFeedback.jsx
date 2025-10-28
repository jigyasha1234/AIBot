export default function RatingFeedback({ rating, setRating }) {
  return (
    <div className="rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => setRating(star)}
          className={star <= rating ? "filled" : ""}
        >
          ★
        </span>
      ))}
    </div>
  );
}
