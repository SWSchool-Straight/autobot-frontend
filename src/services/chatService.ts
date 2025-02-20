import { chatApi } from '../api/chatApi';
import { ChatMessage, BotMessage, UserMessage, BotChatMessage, SystemMessage } from '../types/chat';
import { ApiError } from '../utils/errorHandler';


export const chatService = {

    // content 타입을 체크하는 헬퍼 함수 추가
  getMessageContent(content: any): string {
    if (typeof content === 'string') {
      return content;
    }
    if (content && typeof content === 'object' && 'query' in content) {
      return content.query;
    }
    return '메시지를 표시할 수 없습니다.';
  },


  createBotMessages(response: BotMessage, isAuthenticated: boolean): BotChatMessage[] {
    try {
      const messages: BotChatMessage[] = [];
      const now = new Date().toISOString();
      
      const bedrockResponse = response.bedrockResponse;
      if (!bedrockResponse) {
        // bedrockResponse가 없는 경우 오류 메시지 반환
        return [this.createErrorMessage(response.conversationId, '죄송합니다. 일시적인 오류가 발생했습니다.')];
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
        const systemMessage = this.createSystemMessage(
          response.conversationId,
          '💡 지금 로그인하시면 채팅 기록이 저장됩니다. 로그아웃하거나 새로고침하면 대화 기록이 사라집니다.'
        );
        messages.push(systemMessage);
      }
      
      return messages;

    } catch (error) {
      console.error('createBotMessages 오류:', error);
      // 오류 발생 시 오류 메시지 반환
      return [this.createErrorMessage(response.conversationId, '죄송합니다. 일시적인 오류가 발생했습니다.')];
    }
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

  createErrorMessage(conversationId: string, errorMessage: string): SystemMessage {
    return {
      messageId: Date.now(),
      conversationId,
      content: errorMessage,
      sender: 'SYSTEM',
      sentAt: new Date().toISOString(),
      isSystemMessage: true
    };
  },

  createSystemMessage(conversationId: string, content: string): SystemMessage {
    return {
      messageId: Date.now(),
      conversationId,
      content,
      sender: 'SYSTEM',
      sentAt: new Date().toISOString(),
      isSystemMessage: true
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
        throw new ApiError('응답 데이터가 없습니다.');
      }
      return response.info;
    } catch (error) {
      if (error instanceof ApiError) {
        // 500 에러인 경우 특별한 메시지 처리
        if (error.status === 500) {
          throw new ApiError(
            '죄송합니다. 메시지 처리 중 오류가 발생했습니다.',
            500,
            false,
            undefined,
            true // 재시도 가능하도록 설정
          );
        }
        throw error;
      }
      throw new ApiError('메시지 전송 중 오류가 발생했습니다.');
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