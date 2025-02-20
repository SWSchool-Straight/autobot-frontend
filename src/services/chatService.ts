import { chatApi } from '../api/chatApi';
import { BotMessage, ChatMessage, UserMessage, SystemMessage } from '../types/message';
import { BotApiResponse, CarInfo } from '../types/chat';
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

  createBotMessages(response: BotApiResponse, isAuthenticated: boolean): BotMessage[] {
    try {
      const messages: BotMessage[] = [];
      const now = new Date().toISOString();

      // bedrockResponse가 없거나 query가 없는 경우 에러 처리
      if (!response?.bedrockResponse) {
        return [this.createErrorMessage(response.conversationId, '죄송합니다. 일시적인 오류가 발생했습니다.')];
      }

      const { bedrockResponse } = response;

      // 응답이 문자열인 경우
      if (typeof bedrockResponse === 'string') {
        messages.push(this.createBotMessage(response.conversationId, bedrockResponse, now, []));
      } 
      // 응답이 객체인 경우
      else if (typeof bedrockResponse === 'object') {
        // query가 문자열인 경우
        if (typeof bedrockResponse.query === 'string') {
          messages.push(this.createBotMessage(
            response.conversationId,
            bedrockResponse.query,
            now,
            bedrockResponse.goods || []
          ));
        } 
        // query가 객체인 경우 (이전 응답 형식 호환)
        else if (bedrockResponse.query && typeof bedrockResponse.query === 'object') {
          messages.push(this.createBotMessage(
            response.conversationId,
            bedrockResponse.query,
            now,
            bedrockResponse.goods || []
          ));
        } 
        else {
          return [this.createErrorMessage(response.conversationId, '죄송합니다. 응답 형식에 문제가 있습니다.')];
        }
      }

      // 비로그인 사용자에게 안내 메시지 추가
      if (!isAuthenticated) {
        messages.push(this.createSystemMessage(
          response.conversationId,
          '💡 아직 회원이 아닌가요? 로그인하시고 대화 기록을 저장하세요!'
        ));
      }

      return messages;

    } catch (error) {
      console.error('createBotMessages 오류:', error);
      return [this.createErrorMessage(response.conversationId, '죄송합니다. 일시적인 오류가 발생했습니다.')];
    }
  },

  createUserMessage(content: string, conversationId: string): UserMessage {
    return {
      conversationId,
      content,
      sender: 'USER',
      sentAt: new Date().toISOString()
    };
  },

  createBotMessage(
    conversationId: string, 
    content: string, 
    sentAt: string, 
    goods: CarInfo[] = []
  ): BotMessage {
    return {
      conversationId,
      content: content || '응답을 표시할 수 없습니다.',
      sender: 'BOT',
      sentAt,
      goods: Array.isArray(goods) ? goods : []
    };
  },

  createErrorMessage(conversationId: string, errorMessage: string): SystemMessage {
    return {
      conversationId,
      content: errorMessage,
      sender: 'SYSTEM',
      sentAt: new Date().toISOString(),
      isSystemMessage: true
    };
  },

  createSystemMessage(conversationId: string, content: string): SystemMessage {
    return {
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
  ): Promise<BotApiResponse> {
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
    try {
      const response = await chatApi.getConversation(conversationId);
      console.log('채팅 기록 응답:', response); // 디버깅용 로그 추가
      
      if (!response.info) {
        throw new Error('응답 데이터가 없습니다.');
      }

      return response.info.map((message: any): ChatMessage => {
        const baseMessage = {
          conversationId: message.conversationId,
          sender: message.sender,
          sentAt: message.sentAt
        };

        // USER 메시지 처리
        if (message.sender === 'USER') {
          return {
            ...baseMessage,
            content: String(message.content)
          } as UserMessage;
        }

        // BOT 메시지 처리
        if (message.sender === 'BOT') {
          let content = '';
          let goods: CarInfo[] = [];

          // content가 객체인 경우
          if (typeof message.content === 'object' && message.content !== null) {
            content = message.content.query || '';
            goods = Array.isArray(message.content.goods) ? message.content.goods : [];
          } else {
            content = String(message.content);
          }

          return {
            ...baseMessage,
            content,
            sender: 'BOT',
            goods
          } as BotMessage;
        }

        // SYSTEM 메시지 처리
        return {
          ...baseMessage,
          content: String(message.content),
          sender: 'SYSTEM',
          isSystemMessage: true
        } as SystemMessage;
      });
    } catch (error) {
      console.error('getChathistory 오류:', error);
      throw new ApiError('대화 기록을 불러오는 중 오류가 발생했습니다.');
    }
  }
}; 