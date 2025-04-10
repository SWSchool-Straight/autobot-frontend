import { chatApiClient } from './apiClient';
import { ApiResponse } from '../types/apiResponse';
import { BotApiResponse, Conversation } from '../types/chat';
import { BotMessage, ChatMessage } from '../types/message';
import { handleApiError } from '../utils/errorHandler';

export const chatApi = {
  /**
   * 새로운 대화 시작
   */
  async createConversation(content: string): Promise<ApiResponse<Conversation>> {
    try {
      console.log('대화 생성 시작:', { content });
      const response = await chatApiClient.post('/api/conversations', { content });
      if (!response.data?.info?.conversationId) {
        throw new Error('Invalid conversation creation response');
      }
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * 기존 대화에 메시지 추가
   */
  async sendMessage(conversationId: string, content: string): Promise<ApiResponse<BotApiResponse>>  {
    try {
      const response = await chatApiClient.post(`/api/conversations/${conversationId}/messages`, {
        content: `${content}`
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // 대화 목록 조회
  async getConversations(): Promise<ApiResponse<Conversation[]>> {
    try {
      const response = await chatApiClient.get('/api/conversations');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * 채팅방 내에서 대화 조회
   */
  async getConversation(conversationId: string): Promise<ApiResponse<ChatMessage[]>> {
    try {
      const response = await chatApiClient.get(`/api/conversations/${conversationId}/messages`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
}; 