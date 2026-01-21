import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import './ChatInterface.css';

const ChatInterface = ({ userId, isOpen, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load conversation history from local storage or backend
  useEffect(() => {
    if (isOpen) {
      loadConversationHistory();
    }
  }, [isOpen]);

  const loadConversationHistory = async () => {
    try {
      setIsLoading(true);
      // In a real implementation, this would fetch from the backend
      // For now, we'll simulate loading from localStorage
      const savedMessages = localStorage.getItem(`chat-${userId}`);
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      }
    } catch (err) {
      setError('Failed to load conversation history');
      console.error('Error loading conversation:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    try {
      setIsLoading(true);

      // Add user message to UI immediately
      const userMessage = {
        id: Date.now(),
        text: inputValue,
        sender: 'user',
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, userMessage]);
      const newInputValue = inputValue;
      setInputValue('');

      // Get token from localStorage
      const authToken = localStorage.getItem('auth_token');

      // Send message to backend API
      const response = await fetch(`/api/${userId}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}` // Use token from localStorage
        },
        body: JSON.stringify({
          message: newInputValue,
          conversation_id: localStorage.getItem(`conversation-${userId}`) || null
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Add assistant response to messages
      const assistantMessage = {
        id: `assistant-${Date.now()}`,
        text: data.response,
        sender: 'assistant',
        timestamp: data.timestamp,
        toolCalls: data.tool_calls
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Save conversation to localStorage
      const updatedMessages = [...messages, userMessage, assistantMessage];
      localStorage.setItem(`chat-${userId}`, JSON.stringify(updatedMessages));

      // Save conversation ID for future reference
      if (data.conversation_id) {
        localStorage.setItem(`conversation-${userId}`, data.conversation_id);
      }
    } catch (err) {
      setError(`Failed to send message: ${err.message}`);
      console.error('Error sending message:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="chat-interface-overlay">
      <div className="chat-interface">
        <div className="chat-header">
          <h3>AI Task Assistant</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="chat-messages">
          {isLoading && <div className="loading-message">Thinking...</div>}

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`message ${msg.sender === 'user' ? 'user-message' : 'assistant-message'}`}
            >
              <div className="message-content">
                {msg.text}
              </div>
              {msg.toolCalls && msg.toolCalls.length > 0 && (
                <div className="tool-calls">
                  <small>Used tools: {msg.toolCalls.map(tc => tc.name).join(', ')}</small>
                </div>
              )}
              <div className="message-timestamp">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="chat-input-form">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask me to manage your tasks..."
            disabled={isLoading}
            className="chat-input"
          />
          <button type="submit" disabled={isLoading} className="send-button">
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;