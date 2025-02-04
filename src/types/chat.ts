export interface ChatMessage {
  id: string;
  content: string;
  sender: 'bot' | 'user';
  timestamp: Date;
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
}

export interface ChatResponse {
  query: string;
  goods: CarInfo[];
}