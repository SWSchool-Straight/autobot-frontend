import { chatApi } from '../api/chatApi';
import { Conversation } from '../types/chat';

// 현재 대화 ID를 저장할 변수
let currentConversationId: number | null = null;

// 대화 생성 서비스
export const newChatService = {

    // 현재 대화 ID 반환
    getCurrentConversationId(): number | null {
        return currentConversationId;
    },
    
    // 현재 대화 ID 설정
    setCurrentConversationId(id: number | null) {
        currentConversationId = id;
    },
    
    // 대화 기록 탭 생성
    async createTab(
        content: string,
        onSuccess: (conversationId: number, title: string) => void,
        onNavigate: (path: string) => void
      ): Promise<void> {
        try {
          const response = await chatApi.createConversation(content);
          
          if (response.status === 201) {
            const conversationId = response.info?.conversationId;
            const title = response.info?.title;

            if (conversationId) {
              this.setCurrentConversationId(conversationId);
              onSuccess(conversationId, title || '새 대화');
              onNavigate(`/history/${conversationId}`);
            }
          }

        } catch (error) {
          console.error('대화 생성 중 에러 발생:', error);
          throw error;
        }
    },

    // 대화 목록 조회
    async getConversationList(): Promise<Array<Conversation>> {
        try {
            const response = await chatApi.getConversations();
            
            if (response.status === 200 && response.info) {
                return response.info.sort((a: any, b: any) => 
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                );
            }
            
            return [];
        } catch (error) {
            console.error('대화 목록 조회 중 에러 발생:', error);
            throw error;
        }
    },
}