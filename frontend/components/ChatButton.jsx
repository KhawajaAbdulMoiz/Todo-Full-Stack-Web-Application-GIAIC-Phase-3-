import React from 'react';
import './ChatButton.css';

const ChatButton = ({ onClick }) => {
  return (
    <button className="floating-chat-button" onClick={onClick}>
      <div className="chat-icon">💬</div>
    </button>
  );
};

export default ChatButton;