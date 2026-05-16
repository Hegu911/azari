'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown, SlidersHorizontal } from 'lucide-react';
import { Category, Brand } from '@/types';
import { categoriesAPI, brandsAPI } from '@/lib/api';

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  filters: { category: string; brand: string; minPrice: string; maxPrice: string; rating: string };
  onChange: (filters: any) => void;
  onClear: () => void;
}

export default function FilterSidebar({ isOpen, onClose, filters, onChange, onClear }: FilterSidebarProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [expanded, setExpanded] = useState({ category: true, brand: true, price: true, rating: true });

  useEffect(() => {
    categoriesAPI.getAll().then(({ data }) => setCategories(data)).catch(() => {});
    brandsAPI.getAll().then(({ data }) => setBrands(data)).catch(() => {});
  }, []);

  const content = (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-charcoal font-light tracking-wide">Filtrlər</h3>
        <button onClick={onClear} className="text-xs text-charcoal/40 hover:text-gold transition-colors cursor-pointer">Təmizlə</button>
      </div>

      <div>
        <button onClick={() => setExpanded((p) => ({ ...p, category: !p.category }))} className="flex items-center justify-between w-full text-sm text-charcoal/80 mb-3 cursor-pointer">
          Kateqoriya <ChevronDown size={14} className={`transition-transform ${expanded.category ? 'rotate-180' : ''}`} />
        </button>
        <AnimatePresence>
          {expanded.category && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="space-y-2 overflow-hidden">
              {categories.map((cat) => (
                <label key={cat.id} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={filters.category === cat.slug}
                    onChange={() => onChange({ ...filters, category: filters.category === cat.slug ? '' : cat.slug })}
                    className="w-4 h-4 rounded border-warm-gray bg-cream-dark text-gold focus:ring-gold"
                  />
                  <span className="text-sm text-charcoal/50 group-hover:text-charcoal/80 transition-colors">{cat.name}</span>
                </label>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div>
        <button onClick={() => setExpanded((p) => ({ ...p, brand: !p.brand }))} className="flex items-center justify-between w-full text-sm text-charcoal/80 mb-3 cursor-pointer">
          Marka <ChevronDown size={14} className={`transition-transform ${expanded.brand ? 'rotate-180' : ''}`} />
        </button>
        <AnimatePresence>
          {expanded.brand && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="space-y-2 overflow-hidden">
              {brands.map((brand) => (
                <label key={brand.id} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={filters.brand === brand.slug}
                    onChange={() => onChange({ ...filters, brand: filters.brand === brand.slug ? '' : brand.slug })}
                    className="w-4 h-4 rounded border-warm-gray bg-cream-dark text-gold focus:ring-gold"
                  />
                  <span className="text-sm text-charcoal/50 group-hover:text-charcoal/80 transition-colors">{brand.name}</span>
                </label>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div>
        <button onClick={() => setExpanded((p) => ({ ...p, price: !p.price }))} className="flex items-center justify-between w-full text-sm text-charcoal/80 mb-3 cursor-pointer">
          Qiymət Aralığı <ChevronDown size={14} className={`transition-transform ${expanded.price ? 'rotate-180' : ''}`} />
        </button>
        <AnimatePresence>
          {expanded.price && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="flex gap-3 overflow-hidden">
              <input
                type="number"
                placeholder="Min."
                value={filters.minPrice}
                onChange={(e) => onChange({ ...filters, minPrice: e.target.value })}
                className="w-full bg-cream-dark border border-warm-gray rounded-lg px-3 py-2 text-charcoal text-sm placeholder:text-charcoal/20 focus:outline-none focus:border-gold"
              />
              <input
                type="number"
                placeholder="Maks."
                value={filters.maxPrice}
                onChange={(e) => onChange({ ...filters, maxPrice: e.target.value })}
                className="w-full bg-cream-dark border border-warm-gray rounded-lg px-3 py-2 text-charcoal text-sm placeholder:text-charcoal/20 focus:outline-none focus:border-gold"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div>
        <button onClick={() => setExpanded((p) => ({ ...p, rating: !p.rating }))} className="flex items-center justify-between w-full text-sm text-charcoal/80 mb-3 cursor-pointer">
          Minimum Reyting <ChevronDown size={14} className={`transition-transform ${expanded.rating ? 'rotate-180' : ''}`} />
        </button>
        <AnimatePresence>
          {expanded.rating && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="space-y-2 overflow-hidden">
              {[4, 3, 2, 1].map((r) => (
                <label key={r} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="rating"
                    checked={filters.rating === String(r)}
                    onChange={() => onChange({ ...filters, rating: filters.rating === String(r) ? '' : String(r) })}
                    className="w-4 h-4 border-warm-gray bg-cream-dark text-gold focus:ring-gold"
                  />
                  <span className="text-sm text-charcoal/50 group-hover:text-charcoal/80">{r}+ ulduz</span>
                </label>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );

  return (
    <>
      <div className="hidden lg:block w-72 shrink-0">{content}</div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] lg:hidden"
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="absolute left-0 top-0 bottom-0 w-[300px] bg-white border-r border-warm-gray p-6 overflow-y-auto"
            >
              <button onClick={onClose} className="absolute top-4 right-4 text-charcoal/40 hover:text-gold cursor-pointer">
                <X size={18} />
              </button>
              {content}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
