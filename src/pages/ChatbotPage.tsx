import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import { chatService } from '../services/chatService';
import { ChatMessage } from '../types/chat';
import '../styles/chatbot-custom.css';
import BotIcon from '../assets/bot_icon.svg';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../contexts/AuthContext';

const ChatbotPage = () => {
  const { isAuthenticated } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [hasStartedChat, setHasStartedChat] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    setHasStartedChat(true);

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await chatService.sendMessage(inputMessage);
      
      // 검색 결과 메시지
      const searchMessage: ChatMessage = {
        id: Date.now().toString(),
        content: response.query,
        sender: 'bot',
        timestamp: new Date()
      };
      
      // 차량 카드 메시지
      const cardsMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: '아래는 검색된 차량들입니다.',
        sender: 'bot',
        timestamp: new Date(),
        goods: response.goods
      };
      
      // 비로그인 사용자의 경우 채팅 저장 안내 메시지 추가
      if (!isAuthenticated) {
        const saveMessage: ChatMessage = {
          id: (Date.now() + 2).toString(),
          content: '💡 지금 로그인하시면 채팅 기록을 저장하실 수 있습니다.',
          sender: 'bot',
          timestamp: new Date(),
          isSystemMessage: true
        };
        setMessages(prev => [...prev, searchMessage, cardsMessage, saveMessage]);
      } else {
        setMessages(prev => [...prev, searchMessage, cardsMessage]);
      }
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        content: '죄송합니다. 일시적인 오류가 발생했습니다.',
        sender: 'bot',
        timestamp: new Date()
      };
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

  // 로그인 유도 배너 컴포넌트
  const LoginBanner = () => (
    <div className="login-banner">
      <p>로그인하시면 더 많은 대화를 나누실 수 있습니다.</p>
      <a href="/login" className="login-button">로그인하기</a>
    </div>
  );

  // 첫 대화 화면 컴포넌트
  const WelcomeScreen = () => (
    <div className="welcome-screen">
      <img src={BotIcon} alt="Bot" className="welcome-bot-avatar" />
      <h1>중고차 챗봇 도우미입니다</h1>
      <div className="welcome-examples">
        <p>다음과 같은 것들을 물어보실 수 있습니다:</p>
        <div className="example-queries">
          <button onClick={() => setInputMessage("2년 미만 중고차를 보여줘")}>
            2년 미만 중고차를 보여줘
          </button>
          <button onClick={() => setInputMessage("2023 그랜저 추천해줘")}>
            2023 그랜저 추천해줘
          </button>
          <button onClick={() => setInputMessage("3000만원 이하 차량 찾아줘")}>
            3000만원 이하 차량 찾아줘
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="chatbot-container">
      {!isAuthenticated && hasStartedChat && <LoginBanner />}
      {isPageLoading && <LoadingSpinner />}
      <div className="chatbot-messages">
        {!hasStartedChat ? (
          <WelcomeScreen />
        ) : (
          <>
            {messages.map((message) => (
              <React.Fragment key={message.id}>
                <div className={`message ${message.sender === 'bot' ? 'bot-message' : 'user-message'} ${message.isSystemMessage ? 'system-message' : ''}`}>
                  {message.sender === 'bot' && !message.isSystemMessage && (
                    <img src={BotIcon} alt="Bot" className="bot-avatar" />
                  )}
                  <div className="message-content">
                    {message.content}
                    {message.isSystemMessage && (
                      <a href="/login" className="login-link">로그인하기</a>
                    )}
                  </div>
                </div>
                {message.goods && message.goods.length > 0 && (
                  <div className="cards-container">
                    <div className="car-cards">
                      {message.goods.map((car) => (
                        <a 
                          href={car.detailUrl} 
                          onClick={(e) => handleCardClick(e, car.detailUrl)}
                          target="_blank" 
                          rel="noopener noreferrer" 
                          key={car.goodsNo} 
                          className="car-card"
                        >
                          <img src={car.imageUrl} alt={car.vehicleName} />
                          <div className="car-info">
                            <h3>{car.vehicleName}</h3>
                            {car.interiorColor && (
                              <p>
                                <span className="label">내부 색상</span>
                                <span>{car.interiorColor}</span>
                              </p>
                            )}
                            <p>
                              <span className="label">주행거리</span>
                              <span>{Number(car.vehicleMile).toLocaleString()} km</span>
                            </p>
                            <p>
                              <span className="label">차량번호</span>
                              <span>{car.vehicleId}</span>
                            </p>
                            <p>
                              <span className="label">최초등록일</span>
                              <span>{car.dateFirstRegistered}</span>
                            </p>
                            <div className="price-info">
                              {car.newCarPrice && (
                                <>
                                  <p className="original-price">
                                    <span className="label">신차가격</span>
                                    <span>{Number(car.newCarPrice).toLocaleString()}원</span>
                                  </p>
                                  <p className="savings">
                                    <span className="label">할인된 금액</span>
                                    <span className="savings-amount">-{Number(car.savingsAmount).toLocaleString()}원</span>
                                  </p>
                                </>
                              )}
                              <p className="final-price">
                                <span className="label">판매가격</span>
                                <span>{Number(car.totalPurchaseAmount).toLocaleString()}원</span>
                              </p>
                            </div>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </>
        )}
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
      
      <form onSubmit={handleSendMessage} className="chatbot-input-form">
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