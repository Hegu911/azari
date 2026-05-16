'use client';

import { Suspense, useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { SlidersHorizontal, X, Search } from 'lucide-react';
import { Product } from '@/types';
import { productsAPI } from '@/lib/api';
import { SORT_OPTIONS } from '@/lib/constants';
import ProductCard from '@/components/shop/ProductCard';
import FilterSidebar from '@/components/shop/FilterSidebar';
import { ProductGridSkeleton } from '@/components/ui/Skeleton';
import Button from '@/components/ui/Button';

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  const [sort, setSort] = useState('newest');
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    brand: '',
    minPrice: '',
    maxPrice: '',
    rating: '',
  });

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = { page, limit: 12, sort };
      if (search) params.search = search;
      if (filters.category) params.category = filters.category;
      if (filters.brand) params.brand = filters.brand;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      if (filters.rating) params.rating = filters.rating;

      const { data } = await productsAPI.getAll(params);
      setProducts(data.products);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  }, [page, sort, search, filters]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const clearFilters = () => {
    setFilters({ category: '', brand: '', minPrice: '', maxPrice: '', rating: '' });
    setSearch('');
    setPage(1);
  };

  const hasActiveFilters = Object.values(filters).some((v) => v) || search;

  return (
    <div className="pt-16 pb-24 md:pt-24 md:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-3"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-light text-charcoal tracking-tight">Mağaza</h1>
            <p className="text-charcoal/40 text-sm mt-1">{total} ətir</p>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden md:flex items-center gap-2">
              <Search size={16} className="text-charcoal/30" />
              <input
                type="text"
                placeholder="Axtar..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="bg-cream-dark border border-warm-gray rounded-xl px-4 py-2 text-charcoal text-sm placeholder:text-charcoal/30 focus:outline-none focus:border-gold w-48"
              />
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-cream-dark border border-warm-gray rounded-xl px-3 py-2 text-xs sm:text-sm focus:outline-none focus:border-gold cursor-pointer"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-white">{opt.label}</option>
              ))}
            </select>
            <button
              onClick={() => setFilterOpen(true)}
              className="lg:hidden flex items-center gap-1 sm:gap-2 text-charcoal/50 hover:text-gold border border-warm-gray rounded-xl px-3 py-2 text-xs sm:text-sm transition-colors cursor-pointer"
            >
              <SlidersHorizontal size={14} className="sm:size-4" />
              Filtrlər
            </button>
          </div>
        </motion.div>

        <div className="flex gap-8">
          <FilterSidebar
            isOpen={filterOpen}
            onClose={() => setFilterOpen(false)}
            filters={filters}
            onChange={(f) => { setFilters(f); setPage(1); }}
            onClear={clearFilters}
          />

          <div className="flex-1 min-w-0">
            {hasActiveFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="flex items-center gap-2 mb-6 flex-wrap"
              >
                <span className="text-xs text-charcoal/30">Aktiv filtrlər:</span>
                {Object.entries(filters).filter(([, v]) => v).map(([key, val]) => {
                  const filterLabels: Record<string, string> = {
                    category: 'Kateqoriya',
                    brand: 'Marka',
                    minPrice: 'Min. Qiymət',
                    maxPrice: 'Maks. Qiymət',
                    rating: 'Reyting',
                  };
                  return (
                  <span key={key} className="inline-flex items-center gap-1 px-3 py-1 bg-cream-dark rounded-full text-xs text-charcoal/50">
                    {filterLabels[key] || key}: {val}
                    <button onClick={() => setFilters({ ...filters, [key]: '' })} className="text-charcoal/30 hover:text-gold cursor-pointer">
                      <X size={12} />
                    </button>
                  </span>
                  );
                })}
                {search && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-cream-dark rounded-full text-xs text-charcoal/50">
                    axtar: {search}
                    <button onClick={() => setSearch('')} className="text-charcoal/30 hover:text-gold cursor-pointer">
                      <X size={12} />
                    </button>
                  </span>
                )}
                <button onClick={clearFilters} className="text-xs text-gold hover:text-gold-dark transition-colors ml-2 cursor-pointer">
                  Təmizlə
                </button>
              </motion.div>
            )}

            {loading ? (
              <ProductGridSkeleton />
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-cream-dark flex items-center justify-center">
                  <SlidersHorizontal size={24} className="text-charcoal/20" />
                </div>
                <h3 className="text-xl font-light text-charcoal/60 mb-2">Məhsul tapılmadı</h3>
                <p className="text-charcoal/30 text-sm mb-6">Filtrləri dəyişməyə çalışın</p>
                <Button variant="secondary" size="sm" onClick={clearFilters}>Filtrləri Təmizlə</Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                  {products.map((product, i) => (
                    <ProductCard key={product.id} product={product} index={i} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-12">
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setPage(i + 1)}
                        className={`w-10 h-10 rounded-xl text-sm transition-all cursor-pointer ${
                          page === i + 1
                            ? 'bg-gold text-white font-medium'
                            : 'bg-cream-dark text-charcoal/40 hover:bg-warm-gray'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={
      <div className="pt-16 pb-24 md:pt-24 md:pb-16">
        <div className="max-w-7xl mx-auto px-4"><ProductGridSkeleton /></div>
      </div>
    }>
      <ShopContent />
    </Suspense>
  );
}
