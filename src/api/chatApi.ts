import { chatApiClient } from './apiClient';
import { ApiResponse } from './apiResponse';
import { BotMessage, Conversation, ChatMessage } from '../types/chat';

export const chatApi = {
  /**
   * 새로운 대화 시작
   */
  async createConversation(content: string): Promise<ApiResponse<Conversation>> {
    const response = await chatApiClient.post('api/conversations', { content });
    return response.data;
  },

  /**
   * 기존 대화에 메시지 추가
   */
  async sendMessage(conversationId: number, content: string): Promise<ApiResponse<BotMessage>>  {
    const response = await chatApiClient.post(`api/conversations/${conversationId}/messages`, { content });
    return response.data;
  },

  // 대화 목록 조회
  async getConversations() {
    const response = await chatApiClient.get('/api/conversations');
    return response.data;
  },

  /**
   * 채팅방 내에서 대화 조회
   */
  async getConversation(conversationId: number): Promise<ApiResponse<ChatMessage[]>> {
    const response = await chatApiClient.get(`/api/conversations/${conversationId}/messages`);
    return response.data;
  },
}; 