export interface Product {
  id: number;
  name: string;
  model: string;
  storage: string;
  price: number;
  description: string;
  category: string;
  image: string | null;
  stock: number;
  featured: boolean;
  colors: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: 'customer' | 'admin';
  token?: string;
}

export interface Order {
  id: number;
  customer_name: string;
  customer_email?: string;
  customer_phone: string;
  total_amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  delivery_method: 'pickup' | 'delivery';
  delivery_address?: string;
  order_notes?: string;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
  color?: string;
  name?: string;
  model?: string;
  storage?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  color: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  pendingOrders: number;
  totalSales: number;
  recentOrders: Order[];
  categoryCounts: { category: string; count: number }[];
  monthlySales: { month: string; total: number; orders: number }[];
}
