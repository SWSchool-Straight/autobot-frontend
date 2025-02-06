import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import WelcomeChat from '../components/WelcomeChat';
import '../styles/chatbot-custom.css';  // chatbot CSS 임포트
import { newChatService } from '../services/newChatService';
import { useChatService } from '../contexts/ChatServiceContext';

const NewChatPage: React.FC = () => {
  const navigate = useNavigate();
  const { createTab, addNewConversation } = useChatService();

  const handleCreateTab = async (message: string) => {
    try {
      // 1. 채팅방 생성
      const { conversationId, title } = await createTab(message);
      
      // 2. 네비게이션 업데이트 및 새 채팅방으로 이동
      addNewConversation(title, conversationId);
      navigate(`/history/${conversationId}`, {
        state: { initialMessage: message }  // 첫 메시지만 전달
      });
    } catch (error) {
      console.error('채팅방 생성 중 오류:', error);
    }
  };

  return <WelcomeChat onStartChat={handleCreateTab} />;
};

export default NewChatPage;