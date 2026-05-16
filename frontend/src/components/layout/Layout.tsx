'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import Header from './Header';
import Footer from './Footer';
import BottomNav from './BottomNav';
import { usePathname } from 'next/navigation';

export default function Layout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith('/login') || pathname?.startsWith('/register') || pathname?.startsWith('/forgot-password');
  const isAdminPage = pathname?.startsWith('/admin');

  const showNavAndFooter = !isAuthPage && !isAdminPage;

  return (
    <>
      {showNavAndFooter && <Header />}
      <main className={isAuthPage ? '' : showNavAndFooter ? 'min-h-screen' : 'min-h-screen'}>
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          {children}
        </motion.div>
      </main>
      {showNavAndFooter && <Footer />}
      {showNavAndFooter && <BottomNav />}
    </>
  );
}
