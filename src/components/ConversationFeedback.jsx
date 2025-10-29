import React, { useState } from 'react';
import { saveConversations, loadConversations, loadCurrentConversation, clearCurrentConversation } from '../services/chatService';
import './ConversationFeedback.css';

const ConversationFeedback = ({ conversationId, onSubmit, onClose }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hoveredStar, setHoveredStar] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Get current conversation from localStorage
    const currentConversation = loadCurrentConversation();
    if (currentConversation) {
      // Add end feedback to conversation
      currentConversation.endFeedback = {
        rating,
        comment
      };
      currentConversation.endedAt = new Date().toISOString();
      
      // Create a title from the first user message if not already set
      if (!currentConversation.title && currentConversation.messages && currentConversation.messages.length > 0) {
        const firstUserMessage = currentConversation.messages.find(msg => msg.type === 'user');
        if (firstUserMessage) {
          currentConversation.title = firstUserMessage.content.substring(0, 50);
        }
      }
      
      // Get existing conversations
      const existingConversations = loadConversations();
      
      // Add current conversation to the list
      const updatedConversations = [currentConversation, ...existingConversations];
      
      // Save to localStorage
      saveConversations(updatedConversations);
      
      // Clear current conversation
      clearCurrentConversation();
    }
    
    onSubmit(rating, comment);
    
    // Navigate back to home for a fresh conversation
    window.location.href = '/';
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => {
      const starValue = index + 1;
      return (
        <button
          key={starValue}
          type="button"
          className={`star ${starValue <= (hoveredStar || rating) ? 'filled' : ''}`}
          onMouseEnter={() => setHoveredStar(starValue)}
          onMouseLeave={() => setHoveredStar(0)}
          onClick={() => setRating(starValue)}
        >
          ⭐
        </button>
      );
    });
  };

  return (
    <div className="feedback-overlay">
      <div className="feedback-modal">
        <div className="feedback-header">
          <h2>Rate this conversation</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="feedback-form">
          <div className="rating-section">
            <label>How would you rate this conversation?</label>
            <div className="stars-container">
              {renderStars()}
            </div>
            <div className="rating-labels">
              <span>Poor</span>
              <span>Excellent</span>
            </div>
          </div>
          
          <div className="comment-section">
            <label htmlFor="feedback-comment">
              Provide Additional Feedback (Optional)
            </label>
            <textarea
              id="feedback-comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell us what you think about this conversation..."
              rows={4}
            />
          </div>
          
          <div className="feedback-actions">
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" className="submit-btn" disabled={rating === 0}>
              Submit Feedback
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConversationFeedback;