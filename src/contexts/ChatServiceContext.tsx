import React, { createContext, useContext } from 'react';

interface ChatServiceContextType {
  addNewConversation: (title: string, conversationId: number) => void;
}

export const ChatServiceContext = createContext<ChatServiceContextType>({
  addNewConversation: () => {},
});

export const useChatService = () => useContext(ChatServiceContext); 