import React, { createContext, useContext } from 'react';

interface ChatServiceContextType {
  // 채팅방 생성만 담당
  createTab: (content: string) => Promise<{conversationId: string, title: string}>;
  // 네비게이션 업데이트만 담당
  addNewConversation: (title: string, id: string) => void;
}

const ChatServiceContext = createContext<ChatServiceContextType | undefined>(undefined);

export const ChatServiceProvider: React.FC<{
  children: React.ReactNode;
  value: ChatServiceContextType;
}> = ({ children, value }) => {
  return (
    <ChatServiceContext.Provider value={value}>
      {children}
    </ChatServiceContext.Provider>
  );
};

export const useChatService = () => {
  const context = useContext(ChatServiceContext);
  if (!context) {
    throw new Error('useChatService must be used within ChatServiceProvider');
  }
  return context;
}; 