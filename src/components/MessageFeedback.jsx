import React, { useState } from 'react';
import './MessageFeedback.css';

const MessageFeedback = ({ message, onFeedback }) => {
  const [showFeedback, setShowFeedback] = useState(false);

  const handleThumbsUp = () => {
    onFeedback(message.id, 'liked', true);
  };

  const handleThumbsDown = () => {
    onFeedback(message.id, 'liked', false);
  };

  return (
    <div 
      className="message-feedback"
      onMouseEnter={() => setShowFeedback(true)}
      onMouseLeave={() => setShowFeedback(false)}
    >
      <div className={`feedback-buttons ${showFeedback ? 'visible' : ''}`}>
        <button
          onClick={handleThumbsUp}
          className={`feedback-btn thumbs-up ${message.feedback?.liked === true ? 'active' : ''}`}
          title="Like this response"
        >
          👍
        </button>
        <button
          onClick={handleThumbsDown}
          className={`feedback-btn thumbs-down ${message.feedback?.liked === false ? 'active' : ''}`}
          title="Dislike this response"
        >
          👎
        </button>
      </div>
    </div>
  );
};

export default MessageFeedback;