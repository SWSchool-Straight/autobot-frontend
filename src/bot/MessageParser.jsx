import React from 'react';
import { chatService } from '../services/chatService';

const MessageParser = ({ children, actions }) => {
  const parse = async (message) => {
    try {
      // 서버로 메시지 전송 및 응답 수신
      const response = await chatService.sendMessage(message);
      actions.handleServerResponse(response.message);
    } catch (error) {
      console.error('서버 통신 오류:', error);
      actions.handleError('죄송합니다. 일시적인 오류가 발생했습니다.');
    }
  };

  return (
    <div>
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, {
          parse: parse,
          actions,
        });
      })}
    </div>
  );
};

export default MessageParser;