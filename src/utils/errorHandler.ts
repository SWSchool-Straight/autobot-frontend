import axios from 'axios';
import { ChatMessage } from '../types/chat';
import { AxiosError } from 'axios';

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

export const handleApiError = (error: any): never => {
  if (error.response) {
    // 서버에서 응답이 왔지만 에러인 경우
    const status = error.response.status;
    const message = error.response.data?.message || error.message || '알 수 없는 오류가 발생했습니다.';
    
    throw new ApiError(
      message,
      status,
      status >= 500, // 500번대 에러는 재시도 가능하도록
      status === 401 ? '/login' : undefined // 401 에러는 로그인 페이지로 리다이렉트
    );
  }
  
  if (error.request) {
    // 요청은 보냈으나 응답을 받지 못한 경우
    throw new ApiError(
      '서버와 통신할 수 없습니다. 네트워크 연결을 확인해주세요.',
      0,
      true
    );
  }
  
  // 그 외의 에러
  throw new ApiError(
    error.message || '알 수 없는 오류가 발생했습니다.',
    0,
    false
  );
};

// 채팅용 에러 메시지 생성
export const createErrorChatMessage = (error: ApiError, conversationId: string): ChatMessage => {
  let content = error.message;
  
  // 재시도 가능한 에러의 경우 안내 메시지 추가
  if (error.shouldRetry) {
    content += ' 잠시 후 다시 시도해 주세요.';
  }
  
  return {
    messageId: Date.now(),
    conversationId,
    content,
    sender: 'SYSTEM',
    sentAt: new Date().toISOString()
  };
}; 