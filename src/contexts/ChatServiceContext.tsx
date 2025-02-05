import React, { createContext, useContext, useState, useEffect } from 'react';
import { newChatService } from '../services/newChatService';

interface Conversation {
  id: number;
  title: string;
  createdAt: string;
}

interface ChatServiceContextType {
  conversations: Conversation[];
  addNewConversation: (title: string, id: number) => void;
  loadConversations: () => Promise<void>;
}

export const ChatServiceContext = createContext<ChatServiceContextType | undefined>(undefined);

export function ChatServiceProvider({ children }: { children: React.ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>([]);

  const loadConversations = async () => {
    try {
      const conversationList = await newChatService.getConversationList();
      setConversations(conversationList.map(conv => ({
        id: conv.conversationId,
        title: conv.title,
        createdAt: conv.createdAt
      })));
    } catch (error) {
      console.error('대화 목록 로딩 중 오류 발생:', error);
    }
  };

  const addNewConversation = (title: string, id: number) => {
    const newConversation = {
      id,
      title,
      createdAt: new Date().toISOString()
    };
    setConversations(prev => [newConversation, ...prev]);
  };

  useEffect(() => {
    loadConversations();
  }, []);

  return (
    <ChatServiceContext.Provider value={{ conversations, addNewConversation, loadConversations }}>
      {children}
    </ChatServiceContext.Provider>
  );
}

export function useChatService() {
  const context = useContext(ChatServiceContext);
  if (context === undefined) {
    throw new Error('useChatService must be used within a ChatServiceProvider');
  }
  return context;
} 