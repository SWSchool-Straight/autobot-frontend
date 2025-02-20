import axios from 'axios';
import { ChatMessage } from '../types/message';

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public shouldRedirect?: boolean,
    public redirectPath?: string,
    public shouldRetry?: boolean
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const handleApiError = (error: any) => {
  if (error.response) {
    // 서버에서 4xx/5xx 응답
    console.error('Server Error:', error.response.data);
  } else if (error.request) {
    // 요청 전송 실패 (네트워크 에러)
    console.error('Network Error:', error.message);
  } else {
    // 기타 에러
    console.error('Unknown Error:', error);
  }
};

// 채팅용 에러 메시지 생성
export const createErrorChatMessage = (error: ApiError, conversationId: string): ChatMessage => {
  let content = error.message;
  
  // 재시도 가능한 에러의 경우 안내 메시지 추가
  if (error.shouldRetry) {
    content += ' 잠시 후 다시 시도해 주세요.';
  }
  
  return {
    conversationId,
    content,
    sender: 'SYSTEM',
    sentAt: new Date().toISOString()
  };
}; 