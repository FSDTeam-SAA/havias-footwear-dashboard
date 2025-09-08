export interface SellerUser {
  _id: string;
  name: string;
  email: string;
  role: "seller" | "admin" | "user" | string;
}

export interface Seller {
  _id: string;
  userId: SellerUser; // nested user object
  businessEmail: string;
  companyName: string;
  taxId: string;
  isApproved: boolean;
  comments?: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  __v: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
}

export interface PaginatedSellers {
  meta: PaginationMeta;
  data: Seller[];
}

export interface SellersResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: PaginatedSellers;
}
