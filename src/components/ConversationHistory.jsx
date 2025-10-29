import React, { useState, useEffect } from 'react';
import { loadConversations } from '../services/chatService';
import { Link } from 'react-router-dom';
import './ConversationHistory.css';

const ConversationHistory = () => {
  const [conversations, setConversations] = useState([]);
  const [filteredConversations, setFilteredConversations] = useState([]);
  const [selectedRating, setSelectedRating] = useState('all');
  const [expandedConversation, setExpandedConversation] = useState(null);

  useEffect(() => {
    const savedConversations = loadConversations();
    setConversations(savedConversations);
    setFilteredConversations(savedConversations);
  }, []);

  useEffect(() => {
    if (selectedRating === 'all') {
      setFilteredConversations(conversations);
    } else {
      const rating = parseInt(selectedRating);
      const filtered = conversations.filter(conv => 
        conv.endFeedback && conv.endFeedback.rating === rating
      );
      setFilteredConversations(filtered);
    }
  }, [selectedRating, conversations]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const getConversationTitle = (conversation) => {
    if (conversation.messages && conversation.messages.length > 0) {
      const firstUserMessage = conversation.messages.find(msg => msg.type === 'user');
      return firstUserMessage ? firstUserMessage.content.substring(0, 50) + '...' : 'New Conversation';
    }
    return 'New Conversation';
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span key={index} className={`star ${index < rating ? 'filled' : ''}`}>
        ⭐
      </span>
    ));
  };

  const toggleExpanded = (conversationId) => {
    setExpandedConversation(
      expandedConversation === conversationId ? null : conversationId
    );
  };

  return (
    <div className="conversation-history">
      <header className="history-header">
        <div className="header-content">
          <Link to="/" className="back-button">← Back to Chat</Link>
          <h1>Past Conversations</h1>
        </div>
      </header>

      <div className="history-controls">
        <div className="filter-section">
          <label htmlFor="rating-filter">Filter by Rating:</label>
          <select 
            id="rating-filter"
            value={selectedRating} 
            onChange={(e) => setSelectedRating(e.target.value)}
            className="rating-filter"
          >
            <option value="all">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>
      </div>

      <div className="conversations-list">
        {filteredConversations.length === 0 ? (
          <div className="no-conversations">
            <p>No conversations found.</p>
            <Link to="/" className="start-chat-btn">Start a New Conversation</Link>
          </div>
        ) : (
          filteredConversations.map((conversation) => (
            <div key={conversation.id} className="conversation-card">
              <div className="conversation-header">
                <div className="conversation-info">
                  <h3>{getConversationTitle(conversation)}</h3>
                  <p className="conversation-date">
                    {formatDate(conversation.createdAt)}
                  </p>
                </div>
                <div className="conversation-actions">
                  <button 
                    className="expand-btn"
                    onClick={() => toggleExpanded(conversation.id)}
                  >
                    {expandedConversation === conversation.id ? '−' : '+'}
                  </button>
                </div>
              </div>

              {conversation.endFeedback && (
                <div className="conversation-rating">
                  <div className="rating-display">
                    {renderStars(conversation.endFeedback.rating)}
                  </div>
                  {conversation.endFeedback.comment && (
                    <p className="feedback-comment">
                      "{conversation.endFeedback.comment}"
                    </p>
                  )}
                </div>
              )}

              {expandedConversation === conversation.id && (
                <div className="conversation-messages">
                  {conversation.messages.map((message) => (
                    <div key={message.id} className={`history-message ${message.type}`}>
                      {message.type === 'user' ? (
                        <div className="user-message">
                          <strong>You:</strong> {message.content}
                        </div>
                      ) : (
                        <div className="ai-message">
                          <div className="ai-content">
                            <strong><span>Soul AI</span>:</strong>
                            <p>{message.content}</p>
                          </div>
                          {message.feedback && message.feedback.liked !== null && (
                            <div className="message-feedback-display">
                              {message.feedback.liked ? '👍' : '👎'}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ConversationHistory;