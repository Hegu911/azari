'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Search as SearchIcon } from 'lucide-react';
import { Product } from '@/types';
import { productsAPI } from '@/lib/api';
import ProductCard from '@/components/shop/ProductCard';
import { ProductGridSkeleton } from '@/components/ui/Skeleton';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = useCallback(async () => {
    if (!query.trim()) { setProducts([]); return; }
    setLoading(true);
    try {
      const { data } = await productsAPI.getAll({ search: query, limit: 20 });
      setProducts(data.products);
    } catch { setProducts([]); }
    finally { setLoading(false); }
  }, [query]);

  useEffect(() => {
    const timer = setTimeout(handleSearch, 500);
    return () => clearTimeout(timer);
  }, [handleSearch]);

  return (
    <div className="pt-16 pb-24 md:pt-24 md:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl md:text-4xl font-light text-charcoal tracking-tight mb-6">Axtarış</h1>
          <div className="relative max-w-xl">
            <SearchIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/30" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ətir axtar..."
              autoFocus
              className="w-full bg-cream-dark border border-warm-gray rounded-full pl-12 pr-6 py-4 text-charcoal placeholder:text-charcoal/20 focus:outline-none focus:border-gold transition-colors"
            />
          </div>
        </motion.div>

        {loading ? (
          <ProductGridSkeleton />
        ) : query && products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-charcoal/40 text-sm">&ldquo;{query}&rdquo; üçün nəticə tapılmadı</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
            {products.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
