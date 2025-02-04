import { ChatResponse } from '../types/chat';

export const chatService = {
  async sendMessage(conversationId: number, content: string): Promise<ChatResponse> {
    try {
      const response = await fetch(`/api/conversations/${conversationId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Authorization 헤더는 토큰이 있을 때만 추가
          ...(localStorage.getItem('accessToken') && {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          })
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '네트워크 응답이 올바르지 않습니다');
      }

      return response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },
}; 