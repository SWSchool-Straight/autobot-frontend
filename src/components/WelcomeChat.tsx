import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import BotIcon from '../assets/bot_icon.svg';

interface WelcomeChatProps {
  onStartChat: (message: string) => void;
}

// 첫 대화 컴포넌트
export default function WelcomeChat({ onStartChat }: WelcomeChatProps) {
  const [inputMessage, setInputMessage] = React.useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    onStartChat(inputMessage);
  };

  const handleExampleClick = (message: string) => {
    onStartChat(message);
  };

  return (
    <>
      <div className="welcome-screen">
        <img src={BotIcon} alt="Bot" className="welcome-bot-avatar" />
        <h1>중고차 챗봇 도우미입니다</h1>
        <div className="welcome-examples">
          <p>다음과 같은 것들을 물어보실 수 있습니다:</p>
          <div className="example-queries">
            <button onClick={() => handleExampleClick("최근 6개월 내 등록된 그랜저 매물 찾아줘")}>
              최근 6개월 내 등록된 그랜저 매물 찾아줘
            </button>
            <button onClick={() => handleExampleClick("주행거리 3만km 이하인 투싼 추천해줘")}>
              주행거리 3만km 이하인 투싼 추천해줘
            </button>
            <button onClick={() => handleExampleClick("4천만원 이하 신차급 SUV 추천해줘")}>
              4천만원 이하 신차급 SUV 추천해줘
            </button>
          </div>
        </div>
      </div>
      <form onSubmit={handleSendMessage} className="chatbot-input-form">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="메시지를 입력하세요..."
          className="chatbot-input"
        />
        <button type="submit" className="chatbot-send-button">
          전송
        </button>
      </form>
    </>
  );
} 