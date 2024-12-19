import Chatbot from 'react-chatbot-kit';
import 'react-chatbot-kit/build/main.css';
import '../styles/chatbot-custom.css'; 

import config from "../bot/config";
import MessageParser from "../bot/MessageParser";
import ActionProvider from "../bot/ActionProvider";

export default function ChatbotPage() {
  return (
    <Chatbot
      config={config}
      messageParser={MessageParser}
      actionProvider={ActionProvider}
    />
  );
}
