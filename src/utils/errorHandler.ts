import axios from 'axios';
import { ChatMessage } from '../types/chat';

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

export const handleApiError = (error: any): ApiError => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const errorMessage = error.response?.data?.message;

    switch (status) {
      // 인증 관련 에러
      case 401:
        return new ApiError(
          errorMessage || '로그인이 필요하거나 인증이 만료되었습니다.',
          status,
          true,
          '/login'
        );
      
      case 403:
        return new ApiError(
          errorMessage || '접근 권한이 없습니다.',
          status,
          true,
          '/chatbot'
        );

      // 리소스 관련 에러
      case 404:
        return new ApiError(
          errorMessage || '요청하신 정보를 찾을 수 없습니다.',
          status,
          true,
          '/chatbot'
        );

      // 요청 제한 에러
      case 429:
        return new ApiError(
          errorMessage || '너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요.',
          status,
          false,
          undefined,
          true // 재시도 가능
        );

      // 서버 에러
      case 500:
        return new ApiError(
          errorMessage || '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
          status,
          false,
          undefined,
          true // 재시도 가능
        );

      case 502:
        return new ApiError(
          errorMessage || '일시적인 서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
          status,
          false,
          undefined,
          true // 재시도 가능
        );

      case 503:
        return new ApiError(
          errorMessage || '서비스가 일시적으로 불가능합니다. 잠시 후 다시 시도해주세요.',
          status,
          false,
          undefined,
          true // 재시도 가능
        );

      // 기타 에러
      default:
        return new ApiError(
          errorMessage || '알 수 없는 오류가 발생했습니다.',
          status,
          false
        );
    }
  }

  // 네트워크 연결 에러
  if (error.request) {
    return new ApiError(
      '서버와 연결할 수 없습니다. 인터넷 연결을 확인해주세요.',
      0,
      false,
      undefined,
      true // 재시도 가능
    );
  }

  // 기타 예상치 못한 에러
  return new ApiError(
    '알 수 없는 오류가 발생했습니다.',
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