'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const collections = [
  { name: 'Oriental', slug: 'oriental', description: 'İsti, ekzotik və cazibədar', color: 'from-amber-300 to-amber-100' },
  { name: 'Floral', slug: 'floral', description: 'Zərif və romantik', color: 'from-pink-300 to-pink-100' },
  { name: 'Woody', slug: 'woody', description: 'Torpaq və sofistike', color: 'from-emerald-300 to-emerald-100' },
  { name: 'Fresh', slug: 'fresh', description: 'Təmiz və enerjili', color: 'from-blue-300 to-blue-100' },
];

export default function LuxuryCollections() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-50px' }} className="mb-8 md:mb-12">
          <p className="text-gold text-sm tracking-[0.3em] uppercase mb-4 font-medium">Kəşf Et</p>
          <h2 className="text-4xl md:text-5xl font-light text-charcoal tracking-tight">Lüks Kolleksiyalar</h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {collections.map((collection, i) => (
            <motion.div key={collection.slug} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <Link href={`/shop?category=${collection.slug}`} className="group block relative h-[250px] md:h-[400px] rounded-2xl overflow-hidden shadow-sm">
                <div className={`absolute inset-0 bg-gradient-to-br ${collection.color} transition-all duration-700 group-hover:scale-110`} />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-all duration-500" />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <h3 className="text-2xl font-light text-charcoal mb-2">{collection.name}</h3>
                  <p className="text-charcoal/60 text-sm mb-4">{collection.description}</p>
                  <span className="inline-flex items-center gap-2 text-gold text-sm tracking-wider group-hover:gap-3 transition-all">
                    Kolleksiyaya Bax <span>→</span>
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
