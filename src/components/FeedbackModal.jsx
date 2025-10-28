import { useState } from "react";
import RatingFeedback from "./RatingFeedback";

export default function FeedbackModal({ onClose }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = () => {
    const feedback = { rating, comment };
    const feedbacks = JSON.parse(localStorage.getItem("feedbacks") || "[]");
    feedbacks.push(feedback);
    localStorage.setItem("feedbacks", JSON.stringify(feedbacks));
    onClose();
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Rate Your Chat</h3>
        <RatingFeedback rating={rating} setRating={setRating} />
        <textarea
          placeholder="Your feedback..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        ></textarea>
        <button onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
}
