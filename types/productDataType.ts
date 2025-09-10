export interface ProductRatingDistribution {
  "1": number;
  "2": number;
  "3": number;
  "4": number;
  "5": number;
}

export interface ProductRating {
  distribution: ProductRatingDistribution;
  average: number;
  total: number;
}

export interface ProductCategory {
  _id: string;
  name: string;
  productType?: string[]; // optional if your category has product types
}

export interface ProductCreatedBy {
  _id: string;
  name: string;
  email?: string; // optional
  profileImage?: string; // optional
}

export interface Product {
  rating: ProductRating;
  _id: string;
  title: string;
  msrp: number;
  moq: number;
  unitPrice: number;
  discountPrice: number;
  quantity: number;
  description: string;
  images: string[];
  category: ProductCategory;
  subCategory: string | null;
  productType: string;
  brand: string;
  colors: string[];
  sizes: string[];
  status: string;
  createdBy: ProductCreatedBy; // changed to object
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  __v: number;
}

export interface ProductMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ProductResponse {
  statusCode: number;
  success: boolean;
  message: string;
  meta: ProductMeta;
  data: Product[];
}
