export interface BuyerProfile {
  _id: string;
  totalOrders: number;
  delivered: number;
  pending: number;
  cancelled: number;
  userId: string;
  userName: string;
}

export interface BuyerProfilesResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: BuyerProfile[];
}
