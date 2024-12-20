import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const chatService = {
  sendMessage: async (message: string) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/assist/chat_with_rag`, 
        { query: message },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          responseType: 'text'
        }
      );
      
      return { message: response.data };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('에러 상세:', error.response?.data);
      }
      throw error;
    }
  }
}; 