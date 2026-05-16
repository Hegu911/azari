'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Heart, ArrowLeft } from 'lucide-react';
import { useWishlist } from '@/store/wishlistContext';
import ProductCard from '@/components/shop/ProductCard';

export default function WishlistPage() {
  const { wishlist, loading } = useWishlist();

  return (
    <div className="pt-16 pb-24 md:pt-24 md:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-light text-charcoal tracking-tight">İstəklərim</h1>
          <p className="text-charcoal/40 text-sm mt-1">{wishlist.length} məhsul</p>
        </motion.div>

        {wishlist.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-cream-dark flex items-center justify-center">
              <Heart size={24} className="text-charcoal/20" />
            </div>
            <h3 className="text-xl font-light text-charcoal/50 mb-2">İstək siyahınız boşdur</h3>
            <p className="text-charcoal/30 text-sm mb-6">Sevimli ətirlərinizi burada saxlayın</p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-8 py-3 bg-gold text-black rounded-full text-sm font-medium hover:bg-gold-dark transition-colors"
            >
              <ArrowLeft size={16} />
              Məhsullara Bax
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
            {wishlist.map((item, i) => (
              <ProductCard key={item.id} product={item.product} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
