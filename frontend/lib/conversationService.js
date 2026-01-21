/**
 * Conversation Service
 * 
 * Handles conversation history loading and storage for the chat interface
 */

class ConversationService {
  /**
   * Load conversation history from storage
   * @param {string} userId - The user ID
   * @returns {Array} Array of conversation messages
   */
  static loadConversation(userId) {
    try {
      const key = `chat-${userId}`;
      const savedMessages = localStorage.getItem(key);
      return savedMessages ? JSON.parse(savedMessages) : [];
    } catch (error) {
      console.error('Error loading conversation:', error);
      return [];
    }
  }

  /**
   * Save conversation history to storage
   * @param {string} userId - The user ID
   * @param {Array} messages - Array of conversation messages
   */
  static saveConversation(userId, messages) {
    try {
      const key = `chat-${userId}`;
      localStorage.setItem(key, JSON.stringify(messages));
    } catch (error) {
      console.error('Error saving conversation:', error);
    }
  }

  /**
   * Get conversation ID from storage
   * @param {string} userId - The user ID
   * @returns {string|null} The conversation ID or null if not found
   */
  static getConversationId(userId) {
    try {
      const key = `conversation-${userId}`;
      return localStorage.getItem(key);
    } catch (error) {
      console.error('Error getting conversation ID:', error);
      return null;
    }
  }

  /**
   * Save conversation ID to storage
   * @param {string} userId - The user ID
   * @param {string} conversationId - The conversation ID
   */
  static saveConversationId(userId, conversationId) {
    try {
      const key = `conversation-${userId}`;
      localStorage.setItem(key, conversationId);
    } catch (error) {
      console.error('Error saving conversation ID:', error);
    }
  }

  /**
   * Clear conversation history from storage
   * @param {string} userId - The user ID
   */
  static clearConversation(userId) {
    try {
      const messageKey = `chat-${userId}`;
      const idKey = `conversation-${userId}`;
      localStorage.removeItem(messageKey);
      localStorage.removeItem(idKey);
    } catch (error) {
      console.error('Error clearing conversation:', error);
    }
  }
}

export default ConversationService;