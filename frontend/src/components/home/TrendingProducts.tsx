'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import { Product } from '@/types';
import { productsAPI } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import { ProductCardSkeleton } from '@/components/ui/Skeleton';

export default function TrendingProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productsAPI.getTrending().then(({ data }) => {
      setProducts(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <section className="py-16 md:py-24 bg-cream overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 md:mb-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
        >
          <p className="text-gold text-sm tracking-[0.3em] uppercase mb-4 font-medium">Məşhur İndi</p>
          <h2 className="text-4xl md:text-5xl font-light text-charcoal tracking-tight">Trend</h2>
        </motion.div>
      </div>

      {loading ? (
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-6 overflow-hidden">
            {Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)}
          </div>
        </div>
      ) : (
        <Swiper
          modules={[Autoplay]}
          spaceBetween={24}
          slidesPerView="auto"
          loop
          autoplay={{ delay: 3000, disableOnInteraction: false, reverseDirection: true }}
          className="!px-4 md:!px-8"
        >
          {products.map((product) => (
            <SwiperSlide key={product.id} className="!w-[200px] md:!w-[280px]">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <Link href={`/product/${product.slug}`} className="group block">
                  <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-warm-gray-light mb-4 shadow-sm">
                    <div
                      className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-all duration-700"
                      style={{ backgroundImage: `url(${product.image || '/images/placeholder.svg'})` }}
                    />
                    <div className="absolute bottom-4 left-4 right-4">
                      <p className="text-white/80 text-xs tracking-wider uppercase mb-1">{product.brand?.name}</p>
                      <h3 className="text-white font-light text-sm truncate">{product.name}</h3>
                      <p className="text-gold text-sm mt-1">{formatPrice(product.price)}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </section>
  );
}
