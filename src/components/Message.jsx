import { useState } from "react";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";

export default function Message({ msg }) {
  const [hover, setHover] = useState(false);

  return (
    <div
      className={`message ${msg.sender}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {msg.sender === "ai" ? <span>Soul AI</span> : <span>You</span>}
      <p>{msg.text}</p>

      {msg.sender === "ai" && hover && (
        <div className="feedback-icons">
          <FaThumbsUp />
          <FaThumbsDown />
        </div>
      )}
    </div>
  );
}
