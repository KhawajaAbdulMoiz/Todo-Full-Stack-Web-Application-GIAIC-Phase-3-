import React from 'react';
import { motion } from 'framer-motion';
import './ChatButton.css';

interface ChatButtonProps {
  onClick: () => void;
}

const ChatButton: React.FC<ChatButtonProps> = ({ onClick }) => {
  return (
    <motion.button
      className="fixed bottom-6 right-6 w-14 h-14 glass-xl rounded-full shadow-lg border border-white/30 flex items-center justify-center z-40 hover:shadow-xl transition-all duration-300"
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", damping: 20, stiffness: 300 }}
    >
      <motion.div
        className="text-2xl"
        animate={{
          rotate: [0, 10, -10, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "loop",
        }}
      >
        💬
      </motion.div>
      <div className="absolute inset-0 rounded-full animate-neon-pulse opacity-75"></div>
    </motion.button>
  );
};

export default ChatButton;