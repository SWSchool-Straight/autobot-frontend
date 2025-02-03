export interface ChatMessage {
  id: string;
  content: string;
  sender: 'bot' | 'user';
  timestamp: Date;
  goods?: {
    goodsNo: string;
    detailUrl: string;
    imageUrl: string;
    vehicleName: string;
    dateFirstRegistered: string;
    vehicleMile: string;
    vehicleId: string;
    totalPurchaseAmount: string;
  }[];
}