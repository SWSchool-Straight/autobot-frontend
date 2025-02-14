import * as React from 'react';
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
        <h1>CICD 테스트입니다</h1>
        <div className="welcome-examples">
          <p>다음과 같은 것들을 물어보실 수 있습니다:</p>
          <div className="example-queries">
            <button onClick={() => handleExampleClick("2천만원 이하의 중고차를 찾아줘")}>
              2천만원 이하의 중고차를 찾아줘
            </button>
            <button onClick={() => handleExampleClick("4인 가족 캠핑을 위한 중고차 찾아줘")}>
              4인 가족 캠핑을 위한 중고차 찾아줘
            </button>
            <button onClick={() => handleExampleClick("스마트크루즈 컨트롤 옵션이 뭐야?")}>
              스마트크루즈 컨트롤 옵션이 뭐야?
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