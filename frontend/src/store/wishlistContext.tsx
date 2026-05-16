'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { WishlistItem } from '@/types';
import { wishlistAPI } from '@/lib/api';
import { useAuth } from './authContext';

interface WishlistContextType {
  wishlist: WishlistItem[];
  loading: boolean;
  isInWishlist: (productId: number) => boolean;
  addToWishlist: (productId: number) => Promise<void>;
  removeFromWishlist: (productId: number) => Promise<void>;
  toggleWishlist: (productId: number) => Promise<void>;
  fetchWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchWishlist = useCallback(async () => {
    if (!user) { setWishlist([]); return; }
    try {
      setLoading(true);
      const { data } = await wishlistAPI.get();
      setWishlist(data);
    } catch { setWishlist([]); }
    finally { setLoading(false); }
  }, [user]);

  useEffect(() => { fetchWishlist(); }, [fetchWishlist]);

  const isInWishlist = (productId: number) => wishlist.some((w) => w.productId === productId);

  const addToWishlist = async (productId: number) => {
    try {
      await wishlistAPI.add(productId);
      await fetchWishlist();
    } catch (error) {
      console.error('Add to wishlist error:', error);
    }
  };

  const removeFromWishlist = async (productId: number) => {
    try {
      await wishlistAPI.remove(productId);
      setWishlist((prev) => prev.filter((w) => w.productId !== productId));
    } catch (error) {
      console.error('Remove from wishlist error:', error);
    }
  };

  const toggleWishlist = async (productId: number) => {
    if (isInWishlist(productId)) {
      await removeFromWishlist(productId);
    } else {
      await addToWishlist(productId);
    }
  };

  return (
    <WishlistContext.Provider value={{ wishlist, loading, isInWishlist, addToWishlist, removeFromWishlist, toggleWishlist, fetchWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within WishlistProvider');
  return context;
}
