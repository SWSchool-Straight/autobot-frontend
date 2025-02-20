import * as React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import WelcomeChat from '../components/WelcomeChat';
import '../styles/welcome-screen.css';  // chatbot CSS 임포트
import { useChatService } from '../contexts/ChatServiceContext';
import LoadingSpinner from '../components/LoadingSpinner';

const NewChatPage: React.FC = () => {
  const navigate = useNavigate();
  const { createTab, addNewConversation } = useChatService();
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateTab = async (message: string) => {
    try {
      setIsLoading(true);
      // 1. 채팅방 생성
      const { conversationId, title } = await createTab(message);
      
      // 2. 네비게이션 업데이트 및 새 채팅방으로 이동
      addNewConversation(title, conversationId);
      navigate(`/history/${conversationId}`, {
        state: { initialMessage: message }  // 첫 메시지만 전달
      });
    } catch (error: any) {
      setIsLoading(false);
      
      // HTTP 상태 코드에 따른 에러 처리
      if (error.response) {
        switch (error.response.status) {
          case 401:
            alert('로그인이 필요한 서비스입니다.');
            navigate('/login');
            break;
          case 429:
            alert('너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요.');
            break;
          case 500:
            alert('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
            break;
          case 503:
            alert('서비스가 일시적으로 불가능합니다. 잠시 후 다시 시도해주세요.');
            break;
          default:
            alert('채팅 서비스 연결에 실패했습니다. 잠시 후 다시 시도해주세요.');
        }
      } else if (error.request) {
        // 요청은 보냈지만 응답을 받지 못한 경우
        alert('서버와 연결할 수 없습니다. 인터넷 연결을 확인해주세요.');
      } else {
        // 요청 설정 중 오류 발생
        alert('채팅을 시작할 수 없습니다. 잠시 후 다시 시도해주세요.');
      }
      console.error('채팅방 생성 중 오류:', error);
    }
  };

  return (
    <>
      {isLoading && <LoadingSpinner />}
      <WelcomeChat onStartChat={handleCreateTab} />
    </>
  );
};

export default NewChatPage;