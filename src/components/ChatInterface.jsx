import { useState, useEffect, useRef } from 'react';
import { getChatResponse, saveCurrentConversation, loadCurrentConversation, generateId } from '../services/chatService';
import MessageFeedback from './MessageFeedback';
import ConversationFeedback from './ConversationFeedback';
import './ChatInterface.css';
import chatIcon from '../assets/chatIcon.svg';
import { useNavigate } from 'react-router-dom';


const ChatInterface = () => {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [conversationId, setConversationId] = useState(null);
    const [showEndFeedback, setShowEndFeedback] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        // Load existing conversation or start new one
        const existingConversation = loadCurrentConversation();
        if (existingConversation) {
            setMessages(existingConversation.messages || []);
            setConversationId(existingConversation.id);
        } else {
            // Start new conversation
            const newConversationId = generateId();
            setConversationId(newConversationId);
            const newConversation = {
                id: newConversationId,
                messages: [],
                createdAt: new Date().toISOString()
            };
            saveCurrentConversation(newConversation);
        }
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleWelcomeCardClick = (message) => {
        setInputValue(message);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!inputValue.trim() || isLoading) return;

        const userMessage = {
            id: generateId(),
            type: 'user',
            content: inputValue.trim(),
            timestamp: new Date().toISOString()
        };

        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);
        setInputValue('');
        setIsLoading(true);

        try {
            const response = await getChatResponse(userMessage.content) ?? "Sorry, Did not understand your query!";

            const aiMessage = {
                id: generateId(),
                type: 'ai',
                content: response,
                timestamp: new Date().toISOString(),
                feedback: {
                    liked: null,
                    rating: null
                }
            };

            const finalMessages = [...updatedMessages, aiMessage];
            setMessages(finalMessages);

            // Save to localStorage
            const currentConversation = loadCurrentConversation();
            if (currentConversation) {
                currentConversation.messages = finalMessages;
                saveCurrentConversation(currentConversation);
            }
        } catch (error) {
            console.error('Error getting response:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleMessageFeedback = (messageId, feedbackType, value) => {
        const updatedMessages = messages.map(msg => {
            if (msg.id === messageId && msg.type === 'ai') {
                return {
                    ...msg,
                    feedback: {
                        ...msg.feedback,
                        [feedbackType]: value
                    }
                };
            }
            return msg;
        });

        setMessages(updatedMessages);

        // Update localStorage
        const currentConversation = loadCurrentConversation();
        if (currentConversation) {
            currentConversation.messages = updatedMessages;
            saveCurrentConversation(currentConversation);
        }
    };

    const navigate = useNavigate();

    const handleSaveConversation = () => {
        setShowEndFeedback(true);
    };

    const handleNewChat = () => {
        // Clear current conversation
        setMessages([]);
        const newConversationId = generateId();
        setConversationId(newConversationId);
        const newConversation = {
            id: newConversationId,
            messages: [],
            createdAt: new Date().toISOString()
        };
        saveCurrentConversation(newConversation);
    };

    const handleEndFeedback = (rating, comment) => {
        setShowEndFeedback(false);
         navigate('/history');
    };

    return (
        <div className="chat-interface" style={{ backgroundColor: "#D7C7F4" }}>
            <header>
                <h1>Bot AI</h1>
                <a href="/" onClick={handleNewChat} data-testid="new-chat">New Chat</a>
            </header>
            
            <div className="chat-container">
                <div className="messages-container">
                    <div style={{ textAlign: "center", marginTop: "100px" }}>
                        <h2 className="chat-heading">
                            How Can I Help You Today
                            <div><img src={chatIcon} alt="Bot AI Logo" className="logo" /></div>
                        </h2>
                    </div>
                    {messages.length === 0 && (
                        <div className="welcome-message">
                            <div className="welcome-cards">
                                <div className="welcome-card" onClick={() => handleWelcomeCardClick("Hi, what is the weather")}>
                                    <h3>Hi, what is the weather</h3>
                                    <p>Get immediate AI generated response</p>
                                </div>
                                <div className="welcome-card" onClick={() => handleWelcomeCardClick("Hi, what is my location")}>
                                    <h3>Hi, what is my location</h3>
                                    <p>Get immediate AI generated response</p>
                                </div>
                                <div className="welcome-card" onClick={() => handleWelcomeCardClick("Hi, what is the temperature")}>
                                    <h3>Hi, what is the temperature</h3>
                                    <p>Get immediate AI generated response</p>
                                </div>
                                <div className="welcome-card" onClick={() => handleWelcomeCardClick("Hi, how are you")}>
                                    <h3>Hi, how are you</h3>
                                    <p>Get immediate AI generated response</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {messages.map((message) => (
                        <div key={message.id} className={`message ${message.type}`}>
                            <div className="message-content">
                                {message.type === 'user' ? (
                                    <div className="user-message">
                                        <span>{message.content}</span>
                                    </div>
                                ) : (
                                    <div className="ai-message">
                                        <div className="ai-header">
                                            <span>Soul AI</span>
                                        </div>
                                        <p>{message.content}</p>
                                        <MessageFeedback
                                            message={message}
                                            onFeedback={handleMessageFeedback}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {isLoading && (
                        <div className="message ai">
                            <div className="message-content">
                                <div className="ai-message">
                                    <div className="ai-header">
                                        <span>Soul AI</span>
                                    </div>
                                    <div className="typing-indicator">
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                <div className="chat-input-container">
                    <form onSubmit={handleSubmit} className="chat-form">
                        <div className="input-wrapper">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                disabled={isLoading}
                                className="chat-input"
                                placeholder="Message Bot AI..."
                            />
                            <button
                                type="submit"
                                className="ask-button"
                            >
                                Ask
                            </button>
                        
                            <button
                                type="button"
                                onClick={handleSaveConversation}
                                className="ask-button"
                            >
                                Save
                            </button>
                            
                        </div>
                    </form>
                </div>
            </div>

            {showEndFeedback && (
                <ConversationFeedback
                    conversationId={conversationId}
                    onSubmit={handleEndFeedback}
                    onClose={() => setShowEndFeedback(false)}
                />
            )}
        </div>
    );
};

export default ChatInterface;