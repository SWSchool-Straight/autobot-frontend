import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { chatService } from '../services/chatService';
import { ChatMessage } from '../types/chat';
import '../styles/chatbot-custom.css';
import BotIcon from '../assets/bot_icon.svg';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../contexts/AuthContext';
import CarCard from '../components/CarCard';

const ChatbotPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const { conversationId } = useParams<{ conversationId: string }>();
  
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
      if (!conversationId) return;
      if (isProcessing.current) return;  // 이미 처리 중이면 실행하지 않음
      
      isProcessing.current = true;  // 처리 시작
      setIsLoading(true);
      
      try {
        if (initialMessage.current) {
          const message = initialMessage.current;
          const userMessage = chatService.createUserMessage(message, Number(conversationId));
          setMessages([userMessage]);
          
          const response = await chatService.sendMessage(Number(conversationId), message);
          const botMessages = chatService.createBotMessages(response, isAuthenticated);
          setMessages([userMessage, ...botMessages]);
          
          initialMessage.current = null;
        } 
        else if (isAuthenticated) {
          // 채팅 기록 로드
          const response = await chatService.getChathistory(Number(conversationId));
          
          // 채팅 기록이 비어있고 location.state에 initialMessage가 있다면
          // (페이지 새로고침 등의 경우)
          if (response.length === 0 && location.state?.initialMessage) {
            const message = location.state.initialMessage;
            const userMessage = chatService.createUserMessage(message, Number(conversationId));
            setMessages([userMessage]);
            
            const chatResponse = await chatService.sendMessage(Number(conversationId), message);
            const botMessages = chatService.createBotMessages(chatResponse, isAuthenticated);
            setMessages([userMessage, ...botMessages]);
          } else {
            setMessages(response);
          }
        }
        isInitialized.current = true;
      } catch (error) {
        console.error('채팅 초기화 중 오류 발생:', error);
        const errorMessage = chatService.createErrorMessage(Number(conversationId));
        setMessages([errorMessage]);
      } finally {
        setIsLoading(false);
        isProcessing.current = false;  // 처리 완료
      }
    };

    isInitialized.current = false;  // 새로운 conversationId로 이동할 때마다 초기화
    initializeChat();
  }, [conversationId, isAuthenticated]);

  // 메시지 전송 처리
  const handleSendMessage = async (e: React.FormEvent, message: string) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return; // 로딩 중이면 메시지 전송 불가

    const userMessage = chatService.createUserMessage(message, Number(conversationId));
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true); // 로딩 시작

    try {
      const chatResponse = await chatService.sendMessage(Number(conversationId), message);
      const botMessages = chatService.createBotMessages(chatResponse, isAuthenticated);
      setMessages(prev => [...prev, ...botMessages]);
    } catch (error) {
      const errorMessage = chatService.createErrorMessage(Number(conversationId));
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false); // 로딩 완료
    }
  };

  const handleCardClick = (e: React.MouseEvent<HTMLAnchorElement>, url: string) => {
    e.preventDefault();
    setIsPageLoading(true);
    window.location.href = url;
  };

  const LoginBanner = () => (
    <div className="login-banner">
      <p>로그인하시면 더 많은 대화를 나누실 수 있습니다.</p>
      <a href="/login" className="login-button">로그인하기</a>
    </div>
  );

  return (
    <div className="chatbot-container">
      {!isAuthenticated && <LoginBanner />}
      {isPageLoading && <LoadingSpinner />}
      <div className="chatbot-messages">
        {messages.map((message) => (
          <React.Fragment key={message.messageId}>
            <div className={`message ${message.sender === 'BOT' ? 'bot-message' : 'user-message'}`}>
              {message.sender === 'BOT' && <img src={BotIcon} alt="Bot" className="bot-avatar" />}
              <div className="message-content">
                {typeof message.content === 'string' 
                  ? message.content 
                  : message.content.query}
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