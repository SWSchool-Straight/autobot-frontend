import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import WelcomeChat from '../components/WelcomeChat';
import '../styles/chatbot-custom.css';  // chatbot CSS 임포트
import { newChatService } from '../services/newChatService';
import { useChatService } from '../contexts/ChatServiceContext';

export default function NewChatPage() {
  const navigate = useNavigate();
  const { addNewConversation } = useChatService();

  const handleCreateTab = async (message: string) => {
    try {
      await newChatService.createTab(message, (conversationId, title) => {
        console.log('conversationId:', conversationId);
        console.log('title:', title);

        // 새로운 대화 기록 탭 추가
        addNewConversation(title, conversationId);

        // 대화 페이지로 이동
        navigate(`/chat/${conversationId}`, { 
            state: { 
              initialMessage: message,
              conversationId: conversationId
            }
        });
      });
    } catch (error) {
      console.error('대화 시작 중 오류 발생:', error);
      // 에러 처리 로직 추가 가능
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