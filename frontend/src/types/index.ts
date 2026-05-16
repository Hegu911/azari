export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  phoneVerified?: boolean;
  avatar?: string;
  address?: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  _count?: { products: number };
}

export interface Brand {
  id: number;
  name: string;
  slug: string;
  logo?: string;
  description?: string;
  _count?: { products: number };
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description?: string;
  price: number;
  comparePrice?: number | null;
  image?: string;
  images: string[];
  categoryId: number;
  brandId: number;
  topNotes?: string;
  middleNotes?: string;
  baseNotes?: string;
  longevity?: string;
  usageType?: string;
  season?: string;
  rating: number;
  reviewCount: number;
  stock: number;
  isFeatured: boolean;
  isBestSeller: boolean;
  isTrending: boolean;
  category?: Category;
  brand?: Brand;
  reviews?: Review[];
  relatedProducts?: Product[];
  createdAt: string;
}

export interface CartItem {
  id: number;
  cartId: number;
  productId: number;
  quantity: number;
  product: Product;
}

export interface Cart {
  id: number;
  userId: number;
  items: CartItem[];
  subtotal: number;
}

export interface Order {
  id: number;
  userId: number;
  orderNumber: string;
  status: string;
  total: number;
  shippingAddress?: string;
  paymentMethod?: string;
  paymentStatus?: string;
  items: OrderItem[];
  createdAt: string;
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  price: number;
  product: Product;
}

export interface Review {
  id: number;
  userId: number;
  productId: number;
  rating: number;
  comment?: string;
  user: { id: number; name: string; avatar?: string };
  createdAt: string;
}

export interface WishlistItem {
  id: number;
  userId: number;
  productId: number;
  product: Product;
  createdAt: string;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
}
