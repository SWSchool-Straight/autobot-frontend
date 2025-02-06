import { chatApi } from '../api/chatApi';

// 현재 대화 ID를 저장할 변수
let currentConversationId: string | null = null;

// 대화 생성 서비스
export const newChatService = {

    // 현재 대화 ID 반환
    getCurrentConversationId(): string | null {
        return currentConversationId;
    },
    
    // 현재 대화 ID 설정
    setCurrentConversationId(id: string | null) {
        currentConversationId = id;
    },
    
    // 대화 기록 탭 생성
    async createTab(content: string): Promise<{ conversationId: string, title: string }> {
        try {
            const response = await chatApi.createConversation(content);
            
            if (response.status === 201 && response.info?.conversationId) {
                const conversationId = response.info.conversationId;
                const title: string = response.info.title || '새 대화';
                this.setCurrentConversationId(conversationId);
                return { conversationId: conversationId, title: title };
            }
            throw new Error('채팅방 생성 실패');
        } catch (error) {
            console.error('대화 생성 중 에러 발생:', error);
            throw error;
        }
    },

    // 대화 목록 조회
    async getConversationList(): Promise<Array<{ conversationId: string, title: string }>> {
        try {
            const response = await chatApi.getConversations();
            
            if (response.status === 200 && response.info) {
                return response.info
                    .sort((a: any, b: any) => 
                        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                    )
                    .slice(0, 5);
            }
            return response.info;
        } catch (error) {
            console.error('대화 목록 조회 중 에러 발생:', error);
            throw error;
        }
    }
};