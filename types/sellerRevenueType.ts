export interface SellerRevenue {
  _id: string;
  totalRevenue: number;
  totalAdminFee: number;
  totalOrders: number;
  sellerId: string;
  sellerName: string;
}

export interface SellerRevenueResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: SellerRevenue[];
}
