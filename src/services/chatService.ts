import { chatApi } from '../api/chatApi';
import { ApiResponse } from '../api/apiResponse';
import { ChatResponse, ChatMessage } from '../types/chat';


export const chatService = {

  createBotMessages(response: ChatResponse, isAuthenticated: boolean): ChatMessage[] {
    const messages: ChatMessage[] = [];

    const bedrockResponse = response.bedrockResponse;
    if (!bedrockResponse) {
      console.error('bedrockResponse가 없습니다.');
      return messages;
    }
    
    if (bedrockResponse.query) {
      messages.push({
        id: Date.now().toString(),
        content: bedrockResponse.query,
        sender: 'bot',
        timestamp: new Date()
      });
    }

    if (bedrockResponse.goods?.length > 0) {
      messages.push({
        id: (Date.now() + 1).toString(),
        content: '아래는 검색된 차량들입니다.',
        sender: 'bot',
        timestamp: new Date(),
        goods: bedrockResponse.goods
      });
    }

    if (!isAuthenticated) {
      messages.push({
        id: (Date.now() + 2).toString(),
        content: '💡 지금 로그인하시면 채팅 기록이 저장됩니다. 로그아웃하거나 새로고침하면 대화 기록이 사라집니다.',
        sender: 'bot',
        timestamp: new Date(),
        isSystemMessage: true
      });
    }

    return messages;
  },

  createUserMessage(content: string): ChatMessage {
    return {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date()
    };
  },

  createErrorMessage(): ChatMessage {
    return {
      id: Date.now().toString(),
      content: '죄송합니다. 일시적인 오류가 발생했습니다.',
      sender: 'bot',
      timestamp: new Date()
    };
  },

  async sendMessage(
    conversationId: number,
    content: string
  ): Promise<ChatResponse> {
    try {
      const response = await chatApi.sendMessage(conversationId, content);
      if (!response.data.info) {
        throw new Error('응답 데이터가 없습니다.');
      }
      return response.data.info;
    } catch (error) {
      console.error('메시지 전송 중 에러 발생:', error);
      throw error;
    }
  }
}; 