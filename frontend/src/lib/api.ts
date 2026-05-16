import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || (typeof window !== 'undefined' ? '/_/backend' : 'http://localhost:5000/api');

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Accept': 'application/json' },
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    if (!config.headers.Authorization) {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data: { name: string; email: string; password: string; phone: string }) => api.post('/auth/register', data),
  login: (data: { email: string; password: string }) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data: { name?: string; phone?: string; address?: string }) => api.put('/auth/profile', data),
  sendOTPRegister: (data: { email: string }) => api.post('/auth/send-otp-register', data),
  verifyOTPRegister: (data: { email: string; code: string }) => api.post('/auth/verify-otp-register', data),
};

export const productsAPI = {
  getAll: (params?: Record<string, string | number>) => api.get('/products', { params }),
  getBySlug: (slug: string) => api.get(`/products/${slug}`),
  getFeatured: () => api.get('/products/featured'),
  getBestSellers: () => api.get('/products/best-sellers'),
  getTrending: () => api.get('/products/trending'),
};

export const categoriesAPI = {
  getAll: () => api.get('/categories'),
  getBySlug: (slug: string) => api.get(`/categories/${slug}`),
};

export const brandsAPI = {
  getAll: () => api.get('/brands'),
  getBySlug: (slug: string) => api.get(`/brands/${slug}`),
};

export const cartAPI = {
  get: () => api.get('/cart'),
  add: (productId: number, quantity?: number) => api.post('/cart/add', { productId, quantity }),
  update: (itemId: number, quantity: number) => api.put(`/cart/update/${itemId}`, { quantity }),
  remove: (itemId: number) => api.delete(`/cart/remove/${itemId}`),
  clear: () => api.delete('/cart/clear'),
};

export const ordersAPI = {
  create: (data: { shippingAddress: string; paymentMethod: string }) => api.post('/orders/create', data),
  getAll: () => api.get('/orders'),
  getById: (id: number) => api.get(`/orders/${id}`),
};

export const wishlistAPI = {
  get: () => api.get('/wishlist'),
  add: (productId: number) => api.post('/wishlist/add', { productId }),
  remove: (productId: number) => api.delete(`/wishlist/remove/${productId}`),
};

export const reviewsAPI = {
  getByProduct: (productId: number) => api.get(`/reviews/product/${productId}`),
  create: (data: { productId: number; rating: number; comment?: string }) => api.post('/reviews/create', data),
};

export default api;
