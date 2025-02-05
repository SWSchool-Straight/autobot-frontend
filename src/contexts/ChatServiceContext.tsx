import React, { createContext, useContext } from 'react';

interface ChatServiceContextType {
  createTab: (content: string) => Promise<void>;
  addNewConversation: (title: string, id: number) => void;
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