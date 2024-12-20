import React from 'react';
import BotIcon from '../assets/bot_icon.svg';


const ChatbotAvatar = () => {
  return (
    <div className="react-chatbot-kit-chat-bot-avatar">
      <div className="react-chatbot-kit-chat-bot-avatar-container">
        <img src={BotIcon} className="react-chatbot-kit-chat-bot-avatar-icon" alt="Bot Icon" />
      </div>
    </div>
  );
};


export default ChatbotAvatar;
