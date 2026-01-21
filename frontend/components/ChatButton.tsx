import React from 'react';
import './ChatButton.css';

interface ChatButtonProps {
  onClick: () => void;
}

const ChatButton: React.FC<ChatButtonProps> = ({ onClick }) => {
  return (
    <button className="floating-chat-button" onClick={onClick}>
      <div className="chat-icon">💬</div>
    </button>
  );
};

export default ChatButton;