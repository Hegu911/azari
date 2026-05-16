'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Star, Heart, Share2 } from 'lucide-react';
import { Product } from '@/types';
import { formatPrice, getDiscountedPrice } from '@/lib/utils';
import Button from '@/components/ui/Button';
import QuantitySelector from '@/components/ui/QuantitySelector';
import { useCart } from '@/store/cartContext';
import { useToast } from '@/components/ui/Toast';
import { useWishlist } from '@/store/wishlistContext';
import { useAuth } from '@/store/authContext';

export default function ProductInfo({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();
  const router = useRouter();

  const handleAddToCart = async () => {
    if (!user) { showToast('info', 'Zəhmət olmasa əvvəlcə daxil olun'); router.push('/login'); return; }
    try {
      await addToCart(product.id, quantity);
      showToast('success', `${product.name} səbətə əlavə edildi`);
    } catch {
      showToast('error', 'Səbətə əlavə etmək mümkün olmadı');
    }
  };

  const handleBuyNow = async () => {
    if (!user) { showToast('info', 'Zəhmət olmasa əvvəlcə daxil olun'); router.push('/login'); return; }
    try {
      await addToCart(product.id, quantity);
      router.push('/checkout');
    } catch {
      showToast('error', 'Səbətə əlavə etmək mümkün olmadı');
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title: product.name, url }); } catch {}
    } else {
      try { await navigator.clipboard.writeText(url); showToast('success', 'Link kopyalandı'); } catch { showToast('error', 'Paylaşmaq mümkün olmadı'); }
    }
  };

  const handleWishlistToggle = () => {
    if (!user) { showToast('info', 'Zəhmət olmasa əvvəlcə daxil olun'); router.push('/login'); return; }
    toggleWishlist(product.id);
  };

  const discount = getDiscountedPrice(product.price, product.comparePrice);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.6 }}
      className="space-y-6"
    >
      <div>
        <p className="text-gold text-sm tracking-wider uppercase mb-2">{product.brand?.name}</p>
        <h1 className="text-3xl md:text-4xl font-light text-charcoal tracking-tight">{product.name}</h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, s) => (
            <Star key={s} size={16} className={s < Math.round(product.rating) ? 'text-gold fill-gold' : 'text-charcoal/10'} />
          ))}
        </div>
        <span className="text-charcoal/40 text-sm">({product.reviewCount} rəy)</span>
      </div>

      <div className="flex items-baseline gap-3">
        <span className="text-2xl font-light text-charcoal">{formatPrice(product.price)}</span>
        {product.comparePrice && (
          <>
            <span className="text-lg text-charcoal/30 line-through">{formatPrice(product.comparePrice)}</span>
            <span className="text-sm text-green-400">{discount}% qənaət</span>
          </>
        )}
      </div>

      <p className="text-charcoal/50 text-sm leading-relaxed">{product.description}</p>

      <div className="flex items-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-green-400' : 'bg-red-400'}`} />
          <span className="text-charcoal/50">{product.stock > 0 ? 'Stokda Var' : 'Stokda Yoxdur'}</span>
        </div>
        <span className="text-charcoal/30">|</span>
        <span className="text-charcoal/50">{product.longevity}</span>
        <span className="text-charcoal/30">|</span>
        <span className="text-charcoal/50">{product.usageType}</span>
      </div>

      <div className="flex items-center gap-4 pt-2">
        <QuantitySelector quantity={quantity} onChange={setQuantity} max={product.stock} />
        <div className="flex gap-3 flex-1">
          <Button variant="gold" size="md" fullWidth onClick={handleAddToCart}>
            Səbətə At
          </Button>
          <Button variant="secondary" size="md" fullWidth onClick={handleBuyNow}>
            İndi Al
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4 pt-2">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleWishlistToggle}
          className="flex items-center gap-2 text-sm text-charcoal/40 hover:text-gold transition-colors cursor-pointer"
        >
          <Heart size={16} className={isInWishlist(product.id) ? 'text-gold fill-gold' : ''} />
          {isInWishlist(product.id) ? 'Saxlanıldı' : 'İstəklərə Əlavə Et'}
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleShare}
          className="flex items-center gap-2 text-sm text-charcoal/40 hover:text-gold transition-colors cursor-pointer"
        >
          <Share2 size={16} />
          Paylaş
        </motion.button>
      </div>
    </motion.div>
  );
}
