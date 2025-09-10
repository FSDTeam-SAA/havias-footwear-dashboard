export interface Buyer {
  _id: string;
  name: string;
  email: string;
}

export interface ProductInOrder {
  _id: string;
  title: string;
  images: string[];
  brand: string;
  createdBy: {
    _id: string;
    name: string;
    email?: string;
    role?: string;
  };
}

export interface OrderItem {
  _id: string;
  product: ProductInOrder | null;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  color: string;
  size: string;
}

export interface ShippingAddress {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface PaymentInfo {
  _id: string;
  method: string;
  status: string;
  paymentDate: string;
  transactionId: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  buyer: Buyer;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  shippingAddress: ShippingAddress;
  paymentInfo: PaymentInfo;
  status: string;
  adminFee: number;
  sellerRevenue: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface OrderMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface OrderResponse {
  statusCode: number;
  success: boolean;
  message: string;
  meta: OrderMeta;
  data: Order[];
}
