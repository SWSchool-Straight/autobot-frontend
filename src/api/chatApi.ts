import { chatApiClient } from './apiClient';
import { ApiResponse } from './apiResponse';
import { BotMessage, Conversation, ChatMessage } from '../types/chat';

export const chatApi = {
  /**
   * 새로운 대화 시작
   */
  async createConversation(content: string): Promise<ApiResponse<Conversation>> {
    console.log('대화 생성 시작:', { content });
    const response = await chatApiClient.post('/api/conversations', { content });
    return response.data;
  },

  /**
   * 기존 대화에 메시지 추가
   */
  async sendMessage(conversationId: string, content: string): Promise<ApiResponse<BotMessage>>  {
    try {
      const response = await chatApiClient.post(`/api/conversations/${conversationId}/messages`, {
        content: `${content}`,  // 또는 content.toString()
        sender: 'USER'
      });
      console.log('메시지 전송 성공:', response.data);
      return response.data;
    } catch (error) {
      console.error('메시지 전송 실패:', error);
      throw error;
    }
  },

  // 대화 목록 조회
  async getConversations() {
    const response = await chatApiClient.get('/api/conversations');
    return response.data;
  },

  /**
   * 채팅방 내에서 대화 조회
   */
  async getConversation(conversationId: string): Promise<ApiResponse<ChatMessage[]>> {
    const response = await chatApiClient.get(`/api/conversations/${conversationId}/messages`);
    return response.data;
  },
}; 