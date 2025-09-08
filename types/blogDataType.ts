export interface Blog {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;   // array of image URLs
  createdBy: string;
  createdAt: string;     // ISO date string
  updatedAt: string;     // ISO date string
  __v: number;
}

export interface BlogMeta {
  total: number;
  page: number;
  limit: number;
}

export interface BlogsResponse {
  statusCode: number;
  success: boolean;
  message: string;
  meta: BlogMeta;
  data: Blog[];
}
