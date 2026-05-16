'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/store/authContext';
import { useCart } from '@/store/cartContext';

const navLinks = [
  { label: 'Ana Səhifə', href: '/' },
  { label: 'Mağaza', href: '/shop' },
  { label: 'Kolleksiyalar', href: '/shop?category=oriental' },
  { label: 'Səbət', href: '/cart', cart: true },
  { label: 'Profil', href: '/profile' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { user } = useAuth();
  const { itemCount } = useCart();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    if (href.startsWith('/shop')) return pathname.startsWith('/shop');
    return pathname.startsWith(href.split('?')[0]);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
      scrolled ? 'bg-cream/90 backdrop-blur-xl border-b border-warm-gray' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 md:h-16">
          <Link href="/" className="block h-10 md:h-12">
            <img src="/logo.png" alt="Azari Parfumes" className="h-full w-auto object-contain" />
          </Link>

          {/* Desktop nav — text only, no icons */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map(({ label, href, cart }) => {
              const active = isActive(href);
              const linkHref = label === 'Profil' ? (user ? '/profile' : '/login') : href;
              return (
                <Link
                  key={label}
                  href={linkHref}
                  className={`relative whitespace-nowrap text-sm font-medium tracking-wider transition-colors ${
                    active ? 'text-gold' : 'text-charcoal/50 hover:text-charcoal/80'
                  }`}
                >
                  {label}
                  {cart && itemCount > 0 && (
                    <span className="ml-1.5 inline-flex items-center justify-center w-4 h-4 bg-gold text-white text-[8px] font-bold rounded-full">
                      {itemCount > 9 ? '9+' : itemCount}
                    </span>
                  )}
                  {active && (
                    <motion.div
                      layoutId="navIndicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold rounded-full"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
