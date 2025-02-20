export interface BotApiResponse {
  createdAt: string;
  bedrockResponse: BedrockResponse;
  conversationId: string;
  title: string;
}

export interface BedrockResponse {
  query: string;
  goods?: CarInfo[];
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
  exteriorColor: string;
  predictedPrice: number;
}

// 대화 목록 조회시 사용하는 타입
export interface Conversation {
  conversationId: string;
  title: string;
  createdAt: string;
}