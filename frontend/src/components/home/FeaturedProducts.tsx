'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectCoverflow } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import { Product } from '@/types';
import { productsAPI } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import { ProductCardSkeleton } from '@/components/ui/Skeleton';

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productsAPI.getFeatured().then(({ data }) => { setProducts(data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  return (
    <section className="py-16 md:py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 md:mb-12">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-50px' }} transition={{ duration: 0.6 }} className="text-center">
          <p className="text-gold text-sm tracking-[0.3em] uppercase mb-4 font-medium">Xüsusi Seçim</p>
          <h2 className="text-4xl md:text-5xl font-light text-charcoal tracking-tight">Seçilmiş Ətirlər</h2>
        </motion.div>
      </div>

      {loading ? (
        <div className="max-w-7xl mx-auto px-4"><div className="grid grid-cols-2 md:grid-cols-4 gap-6">{Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)}</div></div>
      ) : (
        <Swiper modules={[Autoplay, EffectCoverflow]} effect="coverflow" coverflowEffect={{ rotate: 0, stretch: 0, depth: 100, modifier: 2, slideShadows: false }}
          slidesPerView="auto" centeredSlides loop autoplay={{ delay: 4000, disableOnInteraction: false }} className="!px-4">
          {products.map((product) => (
            <SwiperSlide key={product.id} className="!w-[220px] md:!w-[320px]">
              <Link href={`/product/${product.slug}`} className="group block">
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-warm-gray-light mb-4 shadow-sm">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10" />
                  <div className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-all duration-700" style={{ backgroundImage: `url(${product.image || '/images/placeholder.svg'})` }} />
                  <div className="absolute bottom-4 left-4 right-4 z-20">
                    <p className="text-white/80 text-xs tracking-wider uppercase mb-1">{product.brand?.name}</p>
                    <h3 className="text-white font-light text-lg truncate">{product.name}</h3>
                    <p className="text-gold mt-1">{formatPrice(product.price)}</p>
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      )}

      <div className="text-center mt-12">
        <Link href="/shop" className="inline-flex items-center gap-2 text-charcoal/40 hover:text-gold transition-colors text-sm tracking-wider">
          Bütün Ətirlərə Bax <span className="text-lg">→</span>
        </Link>
      </div>
    </section>
  );
}
