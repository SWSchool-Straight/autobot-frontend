import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import { chatService } from '../services/chatService';
import { ChatMessage } from '../types/chat';
import '../styles/chatbot-custom.css';
import BotIcon from '../assets/bot_icon.svg';
import LoadingSpinner from '../components/LoadingSpinner';

const ChatbotPage = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '0',
      content: '안녕하세요. 무엇을 도와드릴까요?',
      sender: 'bot',
      timestamp: new Date()
    },
    // 예시
    {
      id: '1',
      content: '2023 그랜저 추천해주세요',
      sender: 'user',
      timestamp: new Date()
    },
    {
      id: '2',
      content: '총 5대의 2023 그랜저가 검색되었습니다. 검색된 결과에 대해 알려드리겠습니다.',
      sender: 'bot',
      timestamp: new Date(),
      goods: [
        {
          goodsNo: 'HGN240826008529',
          detailUrl: 'https://certified.hyundai.com/p/goods/goodsDetail.do?goodsNo=HGN240826008529',
          imageUrl: 'https://certified-static.hyundai.com/contents/goods/shootConts/tobepic/02/exterior/HGN240826008529/PRD602_233.JPG/dims/crop/2304x1536+600+770/resize/380x253/optimize',
          vehicleName: '2023 그랜저(GN7) 하이브리드 2WD 익스클루시브',
          dateFirstRegistered: '2023-08-24',
          vehicleMile: '28063',
          vehicleId: '215모1676',
          totalPurchaseAmount: '42100000'
        },
        {
          goodsNo: 'HGN241014009561',
          detailUrl: 'https://certified.hyundai.com/p/goods/goodsDetail.do?goodsNo=HGN241014009561',
          imageUrl: 'https://certified-static.hyundai.com/contents/goods/shootConts/tobepic/02/exterior/HGN241014009561/PRD602_233.JPG/dims/crop/2304x1536+600+770/resize/380x253/optimize',
          vehicleName: '2023 그랜저(GN7) 하이브리드 2WD 익스클루시브',
          dateFirstRegistered: '2023-02-16',
          vehicleMile: '20266',
          vehicleId: '376로1843',
          totalPurchaseAmount: '41900000'
        },
        {
          goodsNo: 'HGN240915009123',
          detailUrl: 'https://certified.hyundai.com/p/goods/goodsDetail.do?goodsNo=HGN240915009123',
          imageUrl: 'https://certified-static.hyundai.com/contents/goods/shootConts/tobepic/02/exterior/HGN240915009123/PRD602_233.JPG/dims/crop/2304x1536+600+770/resize/380x253/optimize',
          vehicleName: '2023 그랜저(GN7) 가솔린 3.5 2WD 캘리그래피',
          dateFirstRegistered: '2023-05-19',
          vehicleMile: '15789',
          vehicleId: '142하8821',
          totalPurchaseAmount: '43500000'
        },
        {
          goodsNo: 'HGN240728008123',
          detailUrl: 'https://certified.hyundai.com/p/goods/goodsDetail.do?goodsNo=HGN240728008123',
          imageUrl: 'https://certified-static.hyundai.com/contents/goods/shootConts/tobepic/02/exterior/HGN240728008123/PRD602_233.JPG/dims/crop/2304x1536+600+770/resize/380x253/optimize',
          vehicleName: '2023 그랜저(GN7) 가솔린 2.5 2WD 프리미엄',
          dateFirstRegistered: '2023-03-30',
          vehicleMile: '32150',
          vehicleId: '527무9912',
          totalPurchaseAmount: '38700000'
        },
        {
          goodsNo: 'HGN240630007891',
          detailUrl: 'https://certified.hyundai.com/p/goods/goodsDetail.do?goodsNo=HGN240630007891',
          imageUrl: 'https://certified-static.hyundai.com/contents/goods/shootConts/tobepic/02/exterior/HGN240630007891/PRD602_233.JPG/dims/crop/2304x1536+600+770/resize/380x253/optimize',
          vehicleName: '2023 그랜저(GN7) 하이브리드 2WD 캘리그래피',
          dateFirstRegistered: '2023-06-15',
          vehicleMile: '18920',
          vehicleId: '834라2277',
          totalPurchaseAmount: '45800000'
        }
      ]
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isPageLoading, setIsPageLoading] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

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
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: response.message,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
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

  return (
    <div className="chatbot-container">
      {isPageLoading && <LoadingSpinner />}
      <div className="chatbot-messages">
        {messages.map((message) => (
          <React.Fragment key={message.id}>
            <div className={`message ${message.sender === 'bot' ? 'bot-message' : 'user-message'}`}>
              {message.sender === 'bot' && (
                <img src={BotIcon} alt="Bot" className="bot-avatar" />
              )}
              <div className="message-content">
                {message.content}
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
                        <p className="price">
                          <span className="label">가격</span>
                          <span>{Number(car.totalPurchaseAmount).toLocaleString()}원</span>
                        </p>
                      </div>
                    </a>
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