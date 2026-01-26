import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/lib/auth';
import ConversationService from '@/lib/conversationService';
import { apiClient } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [retryCount, setRetryCount] = useState<number>(0);
  const debounceRef = useRef<NodeJS.Timeout>();
  const maxRetries = 3;

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

  const sendMessageWithRetry = useCallback(async (message: string, attempt: number = 1): Promise<any> => {
    try {
      const data = await apiClient.sendChatMessage(
        userId,
        message,
        ConversationService.getConversationId(userId)
      );
      setRetryCount(0); // Reset retry count on success
      return data;
    } catch (err: any) {
      if (err.status === 429 && attempt < maxRetries) {
        // Rate limited, wait and retry
        const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, delay));
        return sendMessageWithRetry(message, attempt + 1);
      }
      throw err;
    }
  }, [userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    // Clear any existing debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    const message = inputValue.trim();
    setInputValue('');
    setError(null);
    setIsTyping(true);

    try {
      setIsLoading(true);

      // Add user message to UI immediately
      const userMessage: Message = {
        id: Date.now(),
        text: message,
        sender: 'user',
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, userMessage]);

      // Send message with retry logic
      const data = await sendMessageWithRetry(message);

      // Simulate typing delay for better UX
      setIsTyping(false);
      await new Promise(resolve => setTimeout(resolve, 500));

      // Execute tool calls if any
      if (data.tool_calls && data.tool_calls.length > 0) {
        for (const toolCall of data.tool_calls) {
          try {
            if (toolCall.name === 'add_task') {
              await apiClient.createTask({
                title: toolCall.arguments.title,
                description: null,
                completed: false
              });
            }
            // Add more tool executions here as needed
          } catch (toolError) {
            console.error('Error executing tool call:', toolError);
            // Continue with other tool calls even if one fails
          }
        }
      }

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
      setIsTyping(false);
      if (err.status === 429) {
        setError('AI is busy — retrying...');
      } else {
        setError(`Failed to send message: ${err.message}`);
      }
      console.error('Error sending message:', err);
    } finally {
      setIsLoading(false);
    }
  };
if (!isOpen) return null;

return (
  <AnimatePresence>
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="glass-xl rounded-2xl shadow-2xl border border-white/30 w-full max-w-lg h-[600px] flex flex-col overflow-hidden"
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
      >
        {/* Header */}
        <div className="glass p-4 border-b border-white/20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center animate-glow">
              <span className="text-white text-sm">🤖</span>
            </div>
            <div>
              <h3 className="font-semibold text-foreground">AI Task Assistant</h3>
              <p className="text-xs text-muted-foreground">Powered by advanced AI</p>
            </div>
          </div>
          <button
            className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors"
            onClick={onClose}
          >
            <span className="text-muted-foreground">×</span>
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <div className={`max-w-[80%] ${msg.sender === 'user' ? 'order-2' : 'order-1'}`}>
                  {msg.sender === 'assistant' && (
                    <div className="flex items-center space-x-2 mb-1">
                      <div className="w-6 h-6 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center animate-glow">
                        <span className="text-white text-xs">🤖</span>
                      </div>
                      <span className="text-xs text-muted-foreground">Assistant</span>
                    </div>
                  )}
                  <div
                    className={`px-4 py-3 rounded-2xl ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-primary to-secondary text-white ml-auto'
                        : 'glass text-foreground'
                    }`}
                  >
                    <div className="text-sm">{msg.text}</div>
                    {msg.toolCalls && msg.toolCalls.length > 0 && (
                      <div className="mt-2 text-xs opacity-70">
                        Used tools: {msg.toolCalls.map(tc => tc.name).join(', ')}
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1 px-2">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing Indicator */}
          <AnimatePresence>
            {isTyping && (
              <motion.div
                className="flex justify-start"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center animate-glow">
                    <span className="text-white text-xs">🤖</span>
                  </div>
                  <div className="glass px-4 py-3 rounded-2xl">
                    <div className="typing-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                className="flex justify-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <div className="glass border-destructive/50 text-destructive px-4 py-2 rounded-xl text-sm">
                  {error}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="p-4 border-t border-white/20">
          <div className="flex space-x-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask me to manage your tasks..."
              disabled={isLoading}
              className="flex-1 glass border border-white/30 rounded-xl px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
            <motion.button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="glass border border-white/30 rounded-xl px-4 py-3 text-primary hover:bg-primary/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-lg">🚀</span>
            </motion.button>
          </div>
          <div className="mt-2 text-xs text-muted-foreground text-center">
            Quota-friendly AI responses • Rate limited for quality
          </div>
        </form>
      </motion.div>
    </motion.div>
  </AnimatePresence>
);
};

export default ChatInterface;