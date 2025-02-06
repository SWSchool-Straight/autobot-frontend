import { chatApi } from '../api/chatApi';
import { ApiResponse } from '../api/apiResponse';
import { ChatMessage, BotMessage, UserMessage, BotChatMessage, Conversation } from '../types/chat';


export const chatService = {

  createBotMessages(response: BotMessage, isAuthenticated: boolean): BotChatMessage[] {
    const messages: BotChatMessage[] = [];
    const now = new Date().toISOString();
    
    const bedrockResponse = response.bedrockResponse;
    if (!bedrockResponse) {
      console.error('bedrockResponse가 없습니다.');
      return messages;
    }
    
    if (bedrockResponse.goods?.length > 0) {
      messages.push({
        messageId: Date.now() + 1,
        conversationId: response.conversationId,
        content: bedrockResponse,
        sender: 'BOT',
        sentAt: now,
        goods: bedrockResponse.goods
      });
    }

    else if (bedrockResponse.query) {
      messages.push({
        messageId: Date.now(),
        conversationId: response.conversationId,
        content: bedrockResponse.query,
        sender: 'BOT',
        sentAt: now
      });
    }

    if (!isAuthenticated) {
      messages.push({
        messageId: Date.now() + 2,
        conversationId: response.conversationId,
        content: '💡 지금 로그인하시면 채팅 기록이 저장됩니다. 로그아웃하거나 새로고침하면 대화 기록이 사라집니다.',
        sender: 'BOT',
        sentAt: now,
        isSystemMessage: true
      });
    }

    return messages;
  },

  createUserMessage(content: string, conversationId: number): UserMessage {
    return {
      messageId: Date.now(),
      conversationId,
      content,
      sender: 'USER',
      sentAt: new Date().toISOString()
    };
  },

  createErrorMessage(conversationId: number): BotChatMessage {
    return {
      messageId: Date.now(),
      conversationId,
      content: '죄송합니다. 일시적인 오류가 발생했습니다.',
      sender: 'BOT',
      sentAt: new Date().toISOString()
    };
  },

  // 메시지 전송
  async sendMessage(
    conversationId: number,
    content: string
  ): Promise<BotMessage> {
    try {
      const response = await chatApi.sendMessage(conversationId, content);
      if (!response.info) {
        throw new Error('응답 데이터가 없습니다.');
      }
      return response.info;
    } catch (error) {
      console.error('메시지 전송 중 에러 발생:', error);
      throw error;
    }
  },

  // 대화 내용 조회
  async getChathistory(conversationId: number): Promise<ChatMessage[]> {
    const response = await chatApi.getConversation(conversationId);
    console.log(response);
    if (!response.info) {
      throw new Error('응답 데이터가 없습니다.');
    }
    return response.info;
  }
}; 