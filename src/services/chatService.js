import sampleData from '../aiData/sampleData.json';

// Local storage keys
const CONVERSATIONS_KEY = 'chat_conversations';
const CURRENT_CONVERSATION_KEY = 'current_conversation';

// Default fallback response
const defaultResponse = "Sorry, Did not understand your query!";

/**
 * Mock API to simulate chatbot response lookup
 * Matches user input to a question in sampleData.json
 */
export const getChatResponse = (message) => {
  console.log(import.meta.url);

  return new Promise((resolve) => {
    setTimeout(() => {
      const normalized = message.toLowerCase().trim();

      // Try to find an exact match in the sampleData.json
      const found = sampleData.find((item) => 
        item.question.toLowerCase().trim() === normalized
      );

      // Return matched response or default
      resolve(found?.response || defaultResponse);
    }, 400); // Simulated delay
  });
};

// Save conversations to localStorage
export const saveConversations = (conversations) => {
  localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations));
};

// Load conversations from localStorage
export const loadConversations = () => {
  const stored = localStorage.getItem(CONVERSATIONS_KEY);
  return stored ? JSON.parse(stored) : [];
};

// Save current conversation
export const saveCurrentConversation = (conversation) => {
  localStorage.setItem(CURRENT_CONVERSATION_KEY, JSON.stringify(conversation));
  
  // Also save to the main conversations list for persistence
  const conversations = loadConversations();
  const existingIndex = conversations.findIndex(conv => conv.id === conversation.id);
  
  if (existingIndex !== -1) {
    // Update existing conversation
    conversations[existingIndex] = conversation;
  } else {
    // Add new conversation
    conversations.push(conversation);
  }
  
  saveConversations(conversations);
};

// Load current conversation
export const loadCurrentConversation = () => {
  const stored = localStorage.getItem(CURRENT_CONVERSATION_KEY);
  return stored ? JSON.parse(stored) : null;
};

// Clear current conversation
export const clearCurrentConversation = () => {
  localStorage.removeItem(CURRENT_CONVERSATION_KEY);
};

// Generate unique ID
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};