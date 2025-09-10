export interface CategoryResponse {
  statusCode: number;
  success: boolean;
  message: string;
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  data: Category[];
}

export interface Category {
  _id: string;
  name: string;
  productType: string[];
  status: "active" | "inactive"; // assuming only these two states
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
  __v: number;
}
