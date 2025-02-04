import { ChatResponse } from '../types/chat';

export const chatService = {
  async sendMessage(message: string): Promise<ChatResponse> {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      return response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },
}; 