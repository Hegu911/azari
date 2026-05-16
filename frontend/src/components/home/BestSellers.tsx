'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Star } from 'lucide-react';
import { Product } from '@/types';
import { productsAPI } from '@/lib/api';
import { formatPrice, getDiscountedPrice } from '@/lib/utils';
import { ProductCardSkeleton } from '@/components/ui/Skeleton';
import Button from '@/components/ui/Button';
import { useCart } from '@/store/cartContext';
import { useToast } from '@/components/ui/Toast';
import { useWishlist } from '@/store/wishlistContext';

export default function BestSellers() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const { toggleWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    productsAPI.getBestSellers().then(({ data }) => { setProducts(data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const handleAddToCart = async (productId: number, e?: React.MouseEvent) => {
    e?.preventDefault();
    try { await addToCart(productId); showToast('success', 'Səbətə əlavə edildi'); } catch { showToast('error', 'Xəta baş verdi'); }
  };

  return (
    <section className="py-16 md:py-24 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-50px' }} className="flex items-end justify-between mb-8 md:mb-12">
          <div>
            <p className="text-gold text-sm tracking-[0.3em] uppercase mb-4 font-medium">Ən Çox Bəyənilən</p>
            <h2 className="text-4xl md:text-5xl font-light text-charcoal tracking-tight">Çox Satanlar</h2>
          </div>
          <Link href="/shop" className="hidden md:inline-flex items-center gap-2 text-charcoal/40 hover:text-gold transition-colors text-sm tracking-wider">
            Hamısına Bax <span>→</span>
          </Link>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
          {products.map((product, i) => (
            <motion.div key={product.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <Link href={`/product/${product.slug}`} className="group block">
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-warm-gray-light mb-4 shadow-sm">
                  <div className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-all duration-700" style={{ backgroundImage: `url(${product.image || '/images/placeholder.svg'})` }} />
                  {product.comparePrice && (
                    <span className="absolute top-3 left-3 bg-gold text-white text-[10px] font-bold px-2 py-1 rounded-full z-10">-{getDiscountedPrice(product.price, product.comparePrice)}%</span>
                  )}
                  <button onClick={(e) => { e.preventDefault(); toggleWishlist(product.id); }}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center z-10 hover:bg-white transition-colors cursor-pointer shadow-sm">
                    <Star size={14} className={isInWishlist(product.id) ? 'text-gold fill-gold' : 'text-charcoal/30'} />
                  </button>
                  <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <Button variant="primary" size="sm" fullWidth onClick={(e) => handleAddToCart(product.id, e)}>Səbətə At</Button>
                  </div>
                </div>
                <p className="text-charcoal/40 text-xs tracking-wider uppercase mb-1">{product.brand?.name}</p>
                <h3 className="text-charcoal font-light text-sm truncate">{product.name}</h3>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center gap-0.5">{Array.from({ length: 5 }).map((_, s) => (<Star key={s} size={10} className={s < Math.round(product.rating) ? 'text-gold fill-gold' : 'text-charcoal/10'} />))}</div>
                  <span className="text-charcoal/30 text-xs">({product.reviewCount})</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-charcoal font-medium">{formatPrice(product.price)}</span>
                  {product.comparePrice && <span className="text-charcoal/30 text-sm line-through">{formatPrice(product.comparePrice)}</span>}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
