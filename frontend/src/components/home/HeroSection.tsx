'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { gsap } from 'gsap';

export default function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const textElements = textRef.current?.querySelectorAll('.reveal-text');
      if (textElements) {
        gsap.fromTo(textElements, { y: 80, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.2, duration: 1.2, ease: 'power4.out' });
      }
    });
    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} className="relative min-h-dvh w-full overflow-hidden bg-gradient-to-b from-cream via-white to-cream-dark">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gold/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-gold/3 rounded-full blur-[80px]" />
      </div>
      <div ref={textRef} className="relative z-10 min-h-full flex flex-col items-center justify-center text-center px-4 pt-16 pb-24 md:pt-24 md:pb-16">
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }}
          className="text-gold text-sm tracking-[0.4em] uppercase mb-6 font-medium">Lüks Ətriyyat 2026</motion.p>
        <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-light text-charcoal tracking-tight leading-none mb-8">
          <span className="reveal-text block">Kəşf Et</span>
          <span className="reveal-text block text-transparent bg-clip-text bg-gradient-to-r from-gold via-gold-dark to-gold">İmza Ətrini</span>
        </h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2, duration: 0.8 }}
          className="text-charcoal/50 text-lg max-w-2xl mb-12 font-light tracking-wide">
          Dünyanın ən nəfis ətirlərindən ibarət kolleksiyamızı kəşf edin. Zamansız zərifliyi qiymətləndirənlər üçün hazırlanmışdır.
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5, duration: 0.8 }} className="flex gap-4">
          <Link href="/shop" className="group relative px-10 py-4 bg-charcoal text-white rounded-full text-sm tracking-wider font-medium overflow-hidden transition-all duration-500 hover:bg-charcoal/90">
            <span className="relative z-10">Kolleksiyaya Bax</span>
          </Link>
          <Link href="/shop?category=best-sellers" className="group relative px-10 py-4 border border-charcoal/20 text-charcoal rounded-full text-sm tracking-wider font-medium overflow-hidden transition-all duration-500 hover:border-gold hover:text-gold">
            <span className="relative z-10">Çox Satanlar</span>
          </Link>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2, duration: 1 }} className="absolute bottom-12 left-1/2 -translate-x-1/2">
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-6 h-10 border-2 border-charcoal/20 rounded-full flex items-start justify-center p-1.5">
            <motion.div className="w-1.5 h-1.5 bg-charcoal/40 rounded-full" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
