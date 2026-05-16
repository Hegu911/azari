'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Cart, CartItem } from '@/types';
import { cartAPI } from '@/lib/api';
import { useAuth } from './authContext';

interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  itemCount: number;
  fetchCart: () => Promise<void>;
  addToCart: (productId: number, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  removeFromCart: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchCart = useCallback(async () => {
    if (!user) {
      setCart(null);
      return;
    }
    try {
      setLoading(true);
      const { data } = await cartAPI.get();
      setCart(data);
    } catch {
      setCart(null);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productId: number, quantity = 1) => {
    try {
      const { data } = await cartAPI.add(productId, quantity);
      setCart(data);
    } catch (error) {
      console.error('Add to cart error:', error);
      throw error;
    }
  };

  const updateQuantity = async (itemId: number, quantity: number) => {
    try {
      const { data } = await cartAPI.update(itemId, quantity);
      setCart((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          items: prev.items.map((item) => (item.id === itemId ? { ...item, quantity } : item)),
        };
      });
    } catch (error) {
      console.error('Update cart error:', error);
      throw error;
    }
  };

  const removeFromCart = async (itemId: number) => {
    try {
      await cartAPI.remove(itemId);
      setCart((prev) => {
        if (!prev) return prev;
        return { ...prev, items: prev.items.filter((item) => item.id !== itemId) };
      });
    } catch (error) {
      console.error('Remove from cart error:', error);
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      await cartAPI.clear();
      setCart((prev) => (prev ? { ...prev, items: [] } : prev));
    } catch (error) {
      console.error('Clear cart error:', error);
      throw error;
    }
  };

  const itemCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <CartContext.Provider value={{ cart, loading, itemCount, fetchCart, addToCart, updateQuantity, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}
