import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import ConversationService from '@/lib/conversationService';
import { apiClient } from '@/lib/api';
import './ChatInterface.css';

interface Message {
  id: string | number;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  toolCalls?: any[];
}

interface ChatInterfaceProps {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ userId, isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Load conversation history from local storage or backend
  useEffect(() => {
    if (isOpen) {
      loadConversationHistory();
    }
  }, [isOpen]);

  const loadConversationHistory = async () => {
    try {
      setIsLoading(true);
      // Use ConversationService to load messages
      const savedMessages = ConversationService.loadConversation(userId);
      if (savedMessages.length > 0) {
        setMessages(savedMessages);
      }
    } catch (err) {
      setError('Failed to load conversation history');
      console.error('Error loading conversation:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    try {
      setIsLoading(true);
      
      // Add user message to UI immediately
      const userMessage: Message = {
        id: Date.now(),
        text: inputValue,
        sender: 'user',
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, userMessage]);
      const newInputValue = inputValue;
      setInputValue('');

      // Send message to backend API using apiClient
      const data = await apiClient.sendChatMessage(
        userId,
        newInputValue,
        ConversationService.getConversationId(userId)
      );
      
      // Add assistant response to messages
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        text: data.response,
        sender: 'assistant',
        timestamp: data.timestamp,
        toolCalls: data.tool_calls
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      // Save conversation using ConversationService
      const updatedMessages = [...messages, userMessage, assistantMessage];
      ConversationService.saveConversation(userId, updatedMessages);

      // Save conversation ID for future reference
      if (data.conversation_id) {
        ConversationService.saveConversationId(userId, data.conversation_id);
      }
    } catch (err: any) {
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