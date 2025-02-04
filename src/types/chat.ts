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
  message: string;
  status: number;
  info: {
    createdAt: string;
    bedrockResponse: {
      query: string;
      goods: CarInfo[];
    };
    conversationId: number;
    title: string;
  };
}