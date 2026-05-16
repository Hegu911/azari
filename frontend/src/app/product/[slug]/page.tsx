'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import { Product } from '@/types';
import { productsAPI } from '@/lib/api';
import ImageGallery from '@/components/product/ImageGallery';
import ProductInfo from '@/components/product/ProductInfo';
import FragranceNotes from '@/components/product/FragranceNotes';
import Reviews from '@/components/product/Reviews';
import ProductCard from '@/components/shop/ProductCard';
import { ProductGridSkeleton } from '@/components/ui/Skeleton';

export default function ProductDetailPage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProduct = () => {
    if (!params.slug) return;
    setLoading(true);
    productsAPI.getBySlug(params.slug as string)
      .then(({ data }) => setProduct(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProduct(); }, [params.slug]);

  if (loading) {
    return (
      <div className="pt-16 pb-24 md:pt-24 md:pb-16 max-w-7xl mx-auto px-4">
        <ProductGridSkeleton count={1} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-16 pb-24 md:pt-24 md:pb-16 text-center">
        <h1 className="text-2xl font-light text-charcoal/50">Məhsul tapılmadı</h1>
        <Link href="/shop" className="text-gold mt-4 inline-block">Mağazaya Qayıt</Link>
      </div>
    );
  }

  return (
    <div className="pt-16 pb-24 md:pt-24 md:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-sm text-charcoal/30 mb-8"
        >
          <Link href="/" className="hover:text-gold transition-colors">Ana Səhifə</Link>
          <ChevronRight size={12} />
          <Link href="/shop" className="hover:text-gold transition-colors">Mağaza</Link>
          <ChevronRight size={12} />
          <span className="text-charcoal/50">{product.name}</span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <ImageGallery images={product.images.length > 0 ? product.images : (product.image ? [product.image] : [])} name={product.name} />
          </motion.div>
          <ProductInfo product={product} />
        </div>

        <div className="mb-20">
          <FragranceNotes
            topNotes={product.topNotes}
            middleNotes={product.middleNotes}
            baseNotes={product.baseNotes}
          />
        </div>

        <div className="mb-20">
          <Reviews
            reviews={product.reviews || []}
            productId={product.id}
            onReviewAdded={fetchProduct}
          />
        </div>

        {product.relatedProducts && product.relatedProducts.length > 0 && (
          <div>
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-lg font-light text-charcoal tracking-wide mb-8"
            >
              Sizə Bunlar da Maraqlı Gələ Bilər
            </motion.h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
              {product.relatedProducts.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
