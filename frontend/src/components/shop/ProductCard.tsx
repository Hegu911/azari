'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Star, Heart } from 'lucide-react';
import { Product } from '@/types';
import { formatPrice, getDiscountedPrice } from '@/lib/utils';
import Button from '@/components/ui/Button';
import { useCart } from '@/store/cartContext';
import { useToast } from '@/components/ui/Toast';
import { useWishlist } from '@/store/wishlistContext';
import { useAuth } from '@/store/authContext';

export default function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();
  const router = useRouter();

  const handleAddToCart = async (e?: React.MouseEvent) => {
    e?.preventDefault();
    if (!user) { showToast('info', 'Zəhmət olmasa əvvəlcə daxil olun'); router.push('/login'); return; }
    try {
      await addToCart(product.id);
      showToast('success', `${product.name} səbətə əlavə edildi`);
    } catch {
      showToast('error', 'Səbətə əlavə etmək mümkün olmadı');
    }
  };

  const discount = getDiscountedPrice(product.price, product.comparePrice);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay: index * 0.05, duration: 0.5 }}
    >
      <Link href={`/product/${product.slug}`} className="group block">
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-warm-gray-light mb-4 shadow-sm">
          <div
            className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-all duration-700 ease-out"
            style={{ backgroundImage: `url(${product.image || '/images/placeholder.svg'})` }}
          />
          {discount && (
            <span className="absolute top-3 left-3 bg-gold text-white text-[10px] font-bold px-2 py-1 rounded-full z-10">
              -{discount}%
            </span>
          )}
          <motion.button
            whileTap={{ scale: 0.8 }}
            onClick={(e) => { e.preventDefault(); if (!user) { showToast('info', 'Zəhmət olmasa əvvəlcə daxil olun'); router.push('/login'); return; } toggleWishlist(product.id); }}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center z-10 hover:bg-white transition-colors cursor-pointer shadow-sm"
          >
            <Heart
              size={14}
              className={isInWishlist(product.id) ? 'text-gold fill-gold' : 'text-charcoal/30'}
            />
          </motion.button>
          <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
            <Button variant="primary" size="sm" fullWidth onClick={handleAddToCart}>
              Sürətli Əlavə
            </Button>
          </div>
        </div>
        <p className="text-charcoal/40 text-xs tracking-wider uppercase mb-1">{product.brand?.name}</p>
        <h3 className="text-charcoal font-light text-sm truncate">{product.name}</h3>
        <div className="flex items-center gap-2 mt-1.5">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, s) => (
              <Star key={s} size={10} className={s < Math.round(product.rating) ? 'text-gold fill-gold' : 'text-charcoal/10'} />
            ))}
          </div>
          <span className="text-charcoal/30 text-xs">({product.reviewCount})</span>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-charcoal font-medium text-sm">{formatPrice(product.price)}</span>
          {product.comparePrice && (
            <span className="text-charcoal/30 text-xs line-through">{formatPrice(product.comparePrice)}</span>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
