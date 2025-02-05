export interface ChatMessage {
  id: string;
  content: string;
  sender: 'bot' | 'user';
  timestamp: Date;
  goods?: CarInfo[];
  isSystemMessage?: boolean;
}

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

export interface ChatResponse {
    createdAt: string;
    bedrockResponse: {
        query: string;
        goods: CarInfo[];
    };
    conversationId: number;
    title: string;
}

export interface Conversation {
    conversationId: number;
    title: string;
    createdAt: string;
}