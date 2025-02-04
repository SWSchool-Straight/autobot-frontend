import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import BotIcon from '../assets/bot_icon.svg';
import '../styles/chatbot-custom.css';  // chatbot CSS 임포트

export default function HomePage() {
  const navigate = useNavigate();
  const [inputMessage, setInputMessage] = React.useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    navigate('/chatbot', { state: { initialMessage: inputMessage } });
  };

  const handleExampleClick = (message: string) => {
    navigate('/chatbot', { state: { initialMessage: message } });
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-messages">
        <div className="welcome-screen">
          <img src={BotIcon} alt="Bot" className="welcome-bot-avatar" />
          <h1>중고차 챗봇 도우미입니다</h1>
          <div className="welcome-examples">
            <p>다음과 같은 것들을 물어보실 수 있습니다:</p>
            <div className="example-queries">
              <button onClick={() => handleExampleClick("2년 미만 중고차를 보여줘")}>
                2년 미만 중고차를 보여줘
              </button>
              <button onClick={() => handleExampleClick("2023 그랜저 추천해줘")}>
                2023 그랜저 추천해줘
              </button>
              <button onClick={() => handleExampleClick("3000만원 이하 차량 찾아줘")}>
                3000만원 이하 차량 찾아줘
              </button>
            </div>
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
    </div>
  );
} 