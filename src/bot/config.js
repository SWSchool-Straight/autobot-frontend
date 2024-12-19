import { createChatBotMessage } from 'react-chatbot-kit';

const config = {
  initialMessages: [
    createChatBotMessage("안녕하세요! 무엇을 도와드릴까요?"),
    createChatBotMessage(
      "Here's a quick overview over what I need to function. ask me about the different parts to dive deeper.",
      {
        withAvatar: false,
        delay: 500,
        widget: 'overview',
      }
    ),
  ],
  customStyles: {
    botMessageBox: {
      backgroundColor: '#386596',
    },
    chatButton: {
      backgroundColor: '#5ccc9d',
    },
  },
};

export default config;