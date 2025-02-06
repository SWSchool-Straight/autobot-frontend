import { chatApi } from '../api/chatApi';
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
        messageId: Date.now(),
        conversationId: response.conversationId,
        content: bedrockResponse.query,
        sender: 'BOT',
        sentAt: now,
        goods: bedrockResponse.goods
      });
    } else {
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
        messageId: Date.now() + 1,
        conversationId: response.conversationId,
        content: '💡 지금 로그인하시면 채팅 기록이 저장됩니다. 로그아웃하거나 새로고침하면 대화 기록이 사라집니다.',
        sender: 'BOT',
        sentAt: now,
        isSystemMessage: true
      });
    }
    
    return messages;
  },

  createUserMessage(content: string, conversationId: string): UserMessage {
    return {
      messageId: Date.now(),
      conversationId,
      content,
      sender: 'USER',
      sentAt: new Date().toISOString()
    };
  },

  createErrorMessage(conversationId: string): BotChatMessage {
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
    conversationId: string,
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
  async getChathistory(conversationId: string): Promise<ChatMessage[]> {
    const response = await chatApi.getConversation(conversationId);
    console.log('채팅 기록 응답:', response); // 디버깅용 로그 추가
    
    if (!response.info) {
      throw new Error('응답 데이터가 없습니다.');
    }

    return response.info.map((message: any): ChatMessage => {
      const baseMessage = {
        messageId: message.messageId,
        conversationId: message.conversationId,
        sender: message.sender,
        sentAt: message.sentAt
      };

      // USER 메시지인 경우
      if (message.sender === 'USER') {
        return {
          ...baseMessage,
          sender: 'USER',
          content: `${message.content}`  // String() 대신 템플릿 리터럴 사용
        } as UserMessage;
      }

      // BOT 메시지인 경우
      const botMessage = {
        ...baseMessage,
        sender: 'BOT'
      } as BotChatMessage;

      // content가 객체인 경우 (차량 정보가 포함된 경우)
      if (typeof message.content === 'object') {
        botMessage.content = message.content.query;
        if (message.content.goods) {
          botMessage.goods = message.content.goods;
        }
      } else {
        botMessage.content = message.content;
      }

      return botMessage;
    });
  }
}; 