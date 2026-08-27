const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options?.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
}

// Products
export const getProducts = (params?: Record<string, string>) => {
  const query = params ? '?' + new URLSearchParams(params).toString() : '';
  return fetchAPI<any>(`/products${query}`);
};

export const getProduct = (id: number) => {
  return fetchAPI<any>(`/products/${id}`);
};

export const getFeaturedProducts = () => {
  return fetchAPI<any>('/products/featured');
};

export const getProductsByCategory = (category: string) => {
  return fetchAPI<any>(`/products/category/${category}`);
};

export const getModels = () => {
  return fetchAPI<any>('/products/models');
};

export const createProduct = (data: any) => {
  return fetchAPI<any>('/products', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const updateProduct = (id: number, data: any) => {
  return fetchAPI<any>(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

export const deleteProduct = (id: number) => {
  return fetchAPI<any>(`/products/${id}`, { method: 'DELETE' });
};

// Auth
export const login = (email: string, password: string) => {
  return fetchAPI<any>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
};

export const register = (data: { name: string; email: string; phone: string; password: string }) => {
  return fetchAPI<any>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const getMe = () => {
  return fetchAPI<any>('/auth/me');
};

// Orders
export const createOrder = (data: any) => {
  return fetchAPI<any>('/orders', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const getOrders = () => {
  return fetchAPI<any>('/orders');
};

export const getOrder = (id: number) => {
  return fetchAPI<any>(`/orders/${id}`);
};

export const updateOrderStatus = (id: number, data: { status?: string; payment_status?: string }) => {
  return fetchAPI<any>(`/orders/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

// Stats
export const getDashboardStats = () => {
  return fetchAPI<any>('/stats/dashboard');
};

// Upload
export const uploadImage = async (file: File) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch(`${API_URL}/upload`, {
    method: 'POST',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });

  return response.json();
};
