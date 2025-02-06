export type Sender = 'USER' | 'BOT';

// 기본 메시지 타입
interface BaseMessage {
  messageId: number;
  conversationId: string;
  sender: Sender;
  sentAt: string;
  isSystemMessage?: boolean;
}

// 사용자 메시지
export interface UserMessage extends BaseMessage {
  sender: 'USER';
  content: string;
}

// 봇 메시지
export interface BotChatMessage extends BaseMessage {
  sender: 'BOT';
  content: string | BedrockResponse;
  goods?: CarInfo[];
}

export type ChatMessage = UserMessage | BotChatMessage;

export interface CarInfo {
  goodsNo: string;
  detailUrl: string;
  imageUrl: string;
  vehicleName: string;
  dateFirstRegistered: string;
  vehicleMile: string;
  vehicleId: string;
  interiorColor: string;
  newCarPrice: string;
  totalPurchaseAmount: string;
  savingsAmount: string;
}

export interface BedrockResponse {
  query: string;
  goods: CarInfo[];
}

// 채팅 메시지 전송 후 받는 봇 응답
export interface BotMessage {
  createdAt: string;
  bedrockResponse: BedrockResponse;
  conversationId: string;
  title: string;
}

// 대화 목록 조회시 사용하는 타입
export interface Conversation {
  conversationId: string;
  title: string;
  createdAt: string;
}