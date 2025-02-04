import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { chatService } from '../services/chatService';
import { ChatMessage } from '../types/chat';
import '../styles/chatbot-custom.css';
import BotIcon from '../assets/bot_icon.svg';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../contexts/AuthContext';
import CarCard from '../components/CarCard';

const ChatbotPage = () => {
  const { isAuthenticated } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const { conversationId } = useParams<{ conversationId: string }>();
  
  // 자동 스크롤
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 초기 메시지 처리
  useEffect(() => {
    const initialMessage = location.state?.initialMessage;
    if (initialMessage && conversationId) {
      // 초기 메시지를 사용자 메시지로 추가
      const userMessage = chatService.createUserMessage(initialMessage);
      setMessages([userMessage]);
      
      // 봇의 응답 요청
      (async () => {
        setIsLoading(true);
        try {
          const chatResponse = await chatService.sendMessage(Number(conversationId), initialMessage);
          const botMessages = chatService.createBotMessages(chatResponse, isAuthenticated);
          setMessages(prev => [...prev, ...botMessages]);
        } catch (error) {
          const errorMessage = chatService.createErrorMessage();
          setMessages(prev => [...prev, errorMessage]);
        } finally {
          setIsLoading(false);
        }
      })();
    }
  }, [conversationId, location.state]);

  // 메시지 전송 처리
  const handleSendMessage = async (e: React.FormEvent, message: string) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage = chatService.createUserMessage(message);
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const chatResponse = await chatService.sendMessage(Number(conversationId), message);
      const botMessages = chatService.createBotMessages(chatResponse, isAuthenticated);
      setMessages(prev => [...prev, ...botMessages]);
    } catch (error) {
      const errorMessage = chatService.createErrorMessage();
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
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
          <React.Fragment key={message.id}>
            <div className={`message ${message.sender === 'bot' ? 'bot-message' : 'user-message'}`}>
              {message.sender === 'bot' && <img src={BotIcon} alt="Bot" className="bot-avatar" />}
              <div className="message-content">{message.content}</div>
            </div>
            {message.goods && message.goods.length > 0 && (
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