'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Category } from '@/types';
import { categoriesAPI } from '@/lib/api';

const categoryGradients: Record<string, string> = {
  oriental: 'from-amber-200 via-amber-100 to-cream',
  floral: 'from-pink-200 via-pink-100 to-cream',
  woody: 'from-emerald-200 via-emerald-100 to-cream',
  fresh: 'from-blue-200 via-blue-100 to-cream',
  oud: 'from-purple-200 via-purple-100 to-cream',
  citrus: 'from-yellow-200 via-yellow-100 to-cream',
};

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    categoriesAPI.getAll().then(({ data }) => setCategories(data)).catch(() => {});
  }, []);

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8 md:mb-12"
        >
          <p className="text-gold text-sm tracking-[0.3em] uppercase mb-4 font-medium">Gözdən Keçir</p>
          <h2 className="text-4xl md:text-5xl font-light text-charcoal tracking-tight">Kateqoriyalar</h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          {categories.map((category, i) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                href={`/shop?category=${category.slug}`}
                className="group relative block h-[200px] rounded-2xl overflow-hidden shadow-sm"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${categoryGradients[category.slug] || 'from-warm-gray to-cream'} transition-all duration-500 group-hover:scale-110`} />
                <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-all duration-500" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="text-charcoal font-light text-lg tracking-wide">{category.name}</h3>
                  <p className="text-charcoal/40 text-xs mt-1">{category._count?.products || 0} ətir</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
