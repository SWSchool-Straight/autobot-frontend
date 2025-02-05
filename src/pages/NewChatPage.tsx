import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import WelcomeChat from '../components/WelcomeChat';
import '../styles/chatbot-custom.css';  // chatbot CSS 임포트
import { newChatService } from '../services/newChatService';
import { useChatService } from '../contexts/ChatServiceContext';
import { chatService } from '../services/chatService';

const NewChatPage: React.FC = () => {
  const navigate = useNavigate();
  const { addNewConversation } = useChatService();

  const handleCreateTab = async (message: string) => {
    try {
      // 1. 채팅방 생성
      await newChatService.createTab(
        message, 
        async (conversationId, title) => {
          // 2. 첫 메시지 전송
          await chatService.sendMessage(conversationId, message);
          
          // 3. 네비게이션 업데이트 및 페이지 이동
          addNewConversation(title, conversationId);
          navigate(`/history/${conversationId}`, {
            state: {
              initialMessage: message,
              conversationId: conversationId
            }
          });
        },
        (path) => navigate(path)
      );
    } catch (error) {
      console.error('대화 시작 중 오류 발생:', error);
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-messages">
        <WelcomeChat onStartChat={handleCreateTab} />
      </div>
    </div>
  );
} 

export default NewChatPage;