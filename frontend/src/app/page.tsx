'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import {
  HeroSection,
  FeaturedProducts,
  LuxuryCollections,
  BestSellers,
  TrendingProducts,
  Categories,
  CustomerReviews,
  Newsletter,
} from '@/components/home';
import LoadingScreen from '@/components/ui/LoadingScreen';

export default function HomePage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence>
        {loading && <LoadingScreen />}
      </AnimatePresence>
      <HeroSection />
      <FeaturedProducts />
      <LuxuryCollections />
      <BestSellers />
      <TrendingProducts />
      <Categories />
      <CustomerReviews />
      <Newsletter />
    </>
  );
}
