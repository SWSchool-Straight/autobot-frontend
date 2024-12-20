import React from 'react';
import 'react-chatbot-kit/build/main.css';
import '../styles/chatbot-custom.css';

import Chatbot from 'react-chatbot-kit';
import config from "../bot/config";
import MessageParser from "../bot/MessageParser";
import ActionProvider from "../bot/ActionProvider";

const ChatbotPage= () => {
  return (
    <Chatbot
      config={config}
      messageParser={MessageParser}
      actionProvider={ActionProvider}
    />
  );
}

export default ChatbotPage;