export interface Color {
  _id: string;
  name: string;
  code: string; // HEX code like "#2434C9"
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  __v: number;
}

export interface ColorsMeta {
  page: number;
  limit: number;
  total: number;
}

export interface ColorsResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    meta: ColorsMeta;
    data: Color[];
  };
}
