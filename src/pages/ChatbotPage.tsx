import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import { useLocation, useParams, useNavigate, useBeforeUnload } from 'react-router-dom';
import { chatService } from '../services/chatService';
import { ChatMessage } from '../types/message';
import '../styles/chatbot-custom.css';
import BotIcon from '../assets/bot_icon.svg';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../contexts/AuthContext';
import CarCard from '../components/CarCard';
import { ApiError, createErrorChatMessage } from '../utils/errorHandler';
import { format } from 'date-fns';


const ChatbotPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const { conversationId } = useParams<{ conversationId: string }>();
  const navigate = useNavigate();
  
  // 초기화 여부를 추적하는 ref
  const isInitialized = useRef(false);
  const initialMessage = useRef(location.state?.initialMessage);
  const isProcessing = useRef(false);  // 처리 중인지 추적하는 ref 추가

  // 자동 스크롤
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 채팅방 초기화
  useEffect(() => {
    const initializeChat = async () => {
      if (conversationId === undefined) return;
      if (isProcessing.current) return;  // 이미 처리 중이면 실행하지 않음
      
      isProcessing.current = true;  // 처리 시작
      setIsLoading(true);
      
      try {
        if (initialMessage.current) {
          const message = initialMessage.current;
          const userMessage = chatService.createUserMessage(message, conversationId);
          setMessages([userMessage]);
          
          try {
            const response = await chatService.sendMessage(conversationId, message);
            const botMessages = chatService.createBotMessages(response, isAuthenticated);
            setMessages([userMessage, ...botMessages]);
          } catch (error) {
            // 에러 메시지 처리 수정
            const errorMessage = chatService.createErrorMessage(
              conversationId,
              '죄송합니다. 메시지 전송 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.'
            );
            setMessages([userMessage, errorMessage]);
          }
          
          initialMessage.current = null;
        } 
        else if (isAuthenticated) {
          try {
            const response = await chatService.getChathistory(conversationId);
            if (response.length === 0) {
              if (location.state?.initialMessage) {
                const message = location.state.initialMessage;
                const userMessage = chatService.createUserMessage(message, conversationId);
                setMessages([userMessage]);
                
                const chatResponse = await chatService.sendMessage(conversationId, message);
                const botMessages = chatService.createBotMessages(chatResponse, isAuthenticated);
                setMessages([userMessage, ...botMessages]);
              } else {
                const errorMessage = chatService.createErrorMessage(
                  conversationId,
                  '채팅 기록이 없습니다.'
                );
                setMessages([errorMessage]);
              }
            } else {
              setMessages(response);
            }
          } catch (error) {
            console.error('채팅 초기화 중 오류 발생:', error);
            const errorMessage = chatService.createErrorMessage(
              conversationId,
              '대화 기록을 불러올 수 없습니다. 잠시 후 다시 시도해 주세요.'
            );
            setMessages([errorMessage]);
          }
        }
        isInitialized.current = true;
      } catch (error) {
        console.error('채팅 초기화 중 오류 발생:', error);
        const errorMessage = chatService.createErrorMessage(
          conversationId,
          '채팅을 시작할 수 없습니다. 잠시 후 다시 시도해 주세요.'
        );
        setMessages([errorMessage]);
      } finally {
        setIsLoading(false);
        isProcessing.current = false;  // 처리 완료
      }
    };

    isInitialized.current = false;  // 새로운 conversationId로 이동할 때마다 초기화
    initializeChat();
  }, [conversationId, isAuthenticated]);

  // 새로고침 감지 및 처리
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!isAuthenticated) {
        e.preventDefault();
        e.returnValue = '새로고침 시 모든 대화 내용이 사라집니다. 계속하시겠습니까?';
        
        sessionStorage.removeItem('chatMessages');
        sessionStorage.removeItem('currentConversationId');
        sessionStorage.setItem('shouldRedirect', 'true');
      }
    };

    // 페이지 로드 시 리다이렉트 체크
    const shouldRedirect = sessionStorage.getItem('shouldRedirect');
    if (shouldRedirect === 'true' && conversationId) {
      sessionStorage.removeItem('shouldRedirect');
      navigate('/chatbot');
    }

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isAuthenticated, conversationId, navigate]);

  // 메시지 상태가 변경될 때마다 세션 스토리지에 저장
  useEffect(() => {
    if (!isAuthenticated && messages.length > 0) {
      sessionStorage.setItem('chatMessages', JSON.stringify(messages));
      sessionStorage.setItem('currentConversationId', conversationId || '');
    }
  }, [messages, conversationId, isAuthenticated]);

  // 컴포넌트 마운트 시 세션 스토리지에서 메시지 복원
  useEffect(() => {
    if (!isAuthenticated && !initialMessage.current) {
      const savedMessages = sessionStorage.getItem('chatMessages');
      const savedConversationId = sessionStorage.getItem('currentConversationId');
      
      if (savedMessages && savedConversationId === conversationId) {
        setMessages(JSON.parse(savedMessages));
      }
    }
  }, [conversationId, isAuthenticated]);

  // 로그아웃 시 세션 스토리지 클리어
  useEffect(() => {
    if (!isAuthenticated) {
      return () => {
        sessionStorage.clear();
      };
    }
  }, [isAuthenticated]);

  // 페이지 이동 전 경고 처리
  useEffect(() => {
    const handleBeforeNavigate = (e: BeforeUnloadEvent | PopStateEvent) => {
      if (!isAuthenticated && messages.length > 0) {
        if (e.type === 'beforeunload') {
          e.preventDefault();
          e.returnValue = '대화 내용이 저장되지 않습니다. 페이지를 나가시겠습니까?';
        } else {
          const confirmLeave = window.confirm('대화 내용이 저장되지 않습니다. 페이지를 나가시겠습니까?');
          if (!confirmLeave) {
            window.history.pushState(null, '', window.location.pathname);
          }
        }
      }
    };

    // 브라우저 뒤로가기/앞으로가기 이벤트 감지
    window.addEventListener('popstate', handleBeforeNavigate);
    // 페이지 새로고침/닫기 이벤트 감지
    window.addEventListener('beforeunload', handleBeforeNavigate);

    return () => {
      window.removeEventListener('popstate', handleBeforeNavigate);
      window.removeEventListener('beforeunload', handleBeforeNavigate);
    };
  }, [isAuthenticated, messages.length]);

  // 메시지 전송 처리
  const handleSendMessage = async (e: React.FormEvent, message: string) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    setIsLoading(true);
    const trimmedMessage = message.trim();
    setInputMessage('');

    try {
      // 사용자 메시지 생성 및 표시
      const userMessage = chatService.createUserMessage(trimmedMessage, conversationId || '');
      setMessages(prev => [...prev, userMessage]);

      // 봇 응답 요청
      const chatResponse = await chatService.sendMessage(conversationId || '', trimmedMessage);
      
      // 봇 메시지 생성
      const botMessages = chatService.createBotMessages(chatResponse, isAuthenticated);
      
      // 전체 메시지 업데이트 (사용자 메시지 유지)
      setMessages(prev => {
        const messagesWithoutLoading = prev.filter(msg => msg !== userMessage);
        return [...messagesWithoutLoading, userMessage, ...botMessages];
      });

    } catch (error) {
      console.error('메시지 전송 오류:', error);
      
      let errorMessage;
      if (error instanceof ApiError && error.shouldRedirect) {
        errorMessage = chatService.createErrorMessage(
          conversationId || '',
          '로그인이 필요한 서비스입니다.'
        );
        // 리다이렉트 처리
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        errorMessage = chatService.createErrorMessage(
          conversationId || '',
          '메시지 전송 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.'
        );
      }

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCardClick = (e: React.MouseEvent<HTMLAnchorElement>, url: string) => {
    e.preventDefault();
    // setIsPageLoading(true);
    window.open(url, '_blank'); // 새 탭에서 열기
  };

  const LoginBanner = () => (
    <div className="login-banner">
      <p>게스트로 접속 시 로그아웃하거나 새로고침하면 대화 기록이 사라집니다. 로그인하시고 대화 기록을 저장하세요!</p>
      <div className="buttons">
        <a href="/login" className="login-button">로그인하기</a>
        <a href="/signup" className="signup-button">회원가입하기</a>
      </div>
    </div>
  );

  return (
    <div className="chatbot-container">
      {!isAuthenticated && <LoginBanner />}
      {isPageLoading && <LoadingSpinner />}
      <div className="chatbot-messages">
        {messages.map((message, index) => (
          <React.Fragment key={`${message.conversationId}-${message.sentAt}-${index}`}>
            <div 
              className={`message ${message.sender === 'BOT' ? 'bot-message' : 'user-message'}`}
              data-is-system={message.isSystemMessage}
            >
              {message.sender === 'BOT' && !message.isSystemMessage && 
                <img src={BotIcon} alt="Bot" className="bot-avatar" />
              }
              <div className="message-wrapper">
                <div className="message-content">
                  {chatService.getMessageContent(message.content)}
                </div>
                {!message.isSystemMessage && (
                  <div className="message-time">
                    {format(new Date(message.sentAt), 'HH:mm')}
                  </div>
                )}
              </div>
            </div>
            {message.sender === 'BOT' && 
              'goods' in message && 
              message.goods && (
              <div className="cards-container">
                <div className="car-cards">
                  {message.goods.map((car) => (
                    <CarCard 
                      key={car.goodsNo}
                      car={car}
                      onCardClick={handleCardClick}
                    />
                  ))}
                </div>
              </div>
            )}
          </React.Fragment>
        ))}
        {isLoading && (
          <div className="message bot-message">
            <img src={BotIcon} alt="Bot" className="bot-avatar" />
            <div className="loading-dots">
              <span>.</span><span>.</span><span>.</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={(e) => handleSendMessage(e, inputMessage)} className="chatbot-input-form">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="메시지를 입력하세요..."
          className="chatbot-input"
        />
        <button type="submit" className="chatbot-send-button" disabled={isLoading}>
          전송
        </button>
      </form>
    </div>
  );
};

export default ChatbotPage;