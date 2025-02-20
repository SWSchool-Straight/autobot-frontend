import { BedrockResponse, CarInfo } from './chat';


export type Sender = 'USER' | 'BOT' | 'SYSTEM';

// 기본 메시지 타입
interface BaseMessage {
  conversationId: string;
  content: string | BedrockResponse;
  sender: Sender;
  sentAt: string;
  isSystemMessage?: boolean;
}

// 사용자 메시지
export interface UserMessage extends BaseMessage {
  sender: 'USER';
}

// 봇 메시지
export interface BotMessage extends BaseMessage {
  sender: 'BOT';
  content: string | BedrockResponse;
  goods?: CarInfo[];
}

// 시스템 메시지
export interface SystemMessage extends BaseMessage {
  sender: 'SYSTEM';
}

export type ChatMessage = UserMessage | BotMessage | SystemMessage;

