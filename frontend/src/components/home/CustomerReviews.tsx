'use client';

import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import { Star, Quote } from 'lucide-react';

const reviews = [
  { name: 'Aygün M.', rating: 5, text: 'Tamamilə möhtəşəm! Ətr bütün gün qalır və hər yerdə iltifat alıram. Mənim imza ətrim oldu.', avatar: 'AM' },
  { name: 'Kamran R.', rating: 5, text: 'Mükəmməl keyfiyyət və qablaşdırma. Lüks brendə layiqdir. Mütləq yenidən sifariş edəcəm.', avatar: 'KR' },
  { name: 'Lalə K.', rating: 4, text: 'Çox gözəl və sofistike ətir. Axşam istifadəsi üçün idealdır. Çatdırılma sürətli idi.', avatar: 'LK' },
  { name: 'Murad D.', rating: 5, text: 'Bir çox ətir mağazası sınamışam, amma bu fərqlənir. Seçimlər qüsursuz və müştəri xidməti dünya səviyyəsindədir.', avatar: 'MD' },
  { name: 'Nərmin L.', rating: 5, text: 'Paketi açan kimi xüsusi bir şey olduğunu hiss etdim. Tam lüks təcrübə.', avatar: 'NL' },
];

export default function CustomerReviews() {
  return (
    <section className="py-16 md:py-24 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 md:mb-12">
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center">
          <p className="text-gold text-sm tracking-[0.3em] uppercase mb-4 font-medium">Rəylər</p>
          <h2 className="text-4xl md:text-5xl font-light text-charcoal tracking-tight">Müştərilərimiz Nə Deyir</h2>
        </motion.div>
      </div>
      <Swiper modules={[Autoplay]} spaceBetween={24} slidesPerView="auto" centeredSlides loop autoplay={{ delay: 3500, disableOnInteraction: false }} className="!px-4">
        {reviews.map((review, i) => (
          <SwiperSlide key={i} className="!w-[280px] md:!w-[400px]">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="bg-white border border-warm-gray rounded-2xl p-8 shadow-sm">
              <Quote size={24} className="text-gold/20 mb-4" />
              <p className="text-charcoal/70 text-sm leading-relaxed mb-6">"{review.text}"</p>
              <div className="flex items-center gap-2 mb-3">{Array.from({ length: 5 }).map((_, s) => (<Star key={s} size={14} className={s < review.rating ? 'text-gold fill-gold' : 'text-charcoal/10'} />))}</div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center"><span className="text-gold text-xs font-medium">{review.avatar}</span></div>
                <span className="text-charcoal/80 text-sm font-light">{review.name}</span>
              </div>
            </motion.div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
