import { createChatBotMessage } from 'react-chatbot-kit';
import ChatbotAvatar from '../components/ChatbotAvatar';

const config = {
  initialMessages: [
    createChatBotMessage("안녕하세요! 무엇을 도와드릴까요?")
  ],
  customStyles: {
    botMessageBox: {
      backgroundColor: '#386596',
    },
    chatButton: {
      backgroundColor: '#86D2FF',
    },
  },
  customComponents: {
    botAvatar: ChatbotAvatar,
  },
};

export default config;