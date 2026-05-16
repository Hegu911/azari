'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Home, Search, ShoppingBag, Heart, User, Sparkles } from 'lucide-react';
import { useCart } from '@/store/cartContext';
import { useAuth } from '@/store/authContext';

export default function BottomNav() {
  const pathname = usePathname();
  const { itemCount } = useCart();
  const { user } = useAuth();

  const navItems = [
    { label: 'Ana Səhifə', href: '/', icon: Home },
    { label: 'Mağaza', href: '/shop', icon: Search },
    { label: 'Kolleksiyalar', href: '/shop?category=oriental', icon: Sparkles },
    { label: 'Səbət', href: '/cart', icon: ShoppingBag },
    { label: 'Profil', href: user ? '/profile' : '/login', icon: User },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    if (href.startsWith('/shop')) return pathname.startsWith('/shop');
    return pathname.startsWith(href.split('?')[0]);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="bg-cream/95 backdrop-blur-2xl border-t border-warm-gray shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <div className="max-w-lg mx-auto flex items-center justify-around py-2 px-2">
          {navItems.map(({ label, href, icon: Icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={label}
                href={href}
                className="relative flex flex-col items-center gap-1 px-3 py-1.5"
              >
                {active && (
                  <motion.div
                    layoutId="bottomNav"
                    className="absolute inset-0 bg-gold/10 rounded-xl"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <div className="relative">
                  <Icon size={22} className={`relative z-10 transition-colors ${
                    active ? 'text-gold' : 'text-charcoal/35'
                  }`} />
                  {label === 'Səbət' && itemCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2 w-4.5 h-4.5 bg-gold text-white text-[8px] font-bold rounded-full flex items-center justify-center z-20"
                    >
                      {itemCount > 9 ? '9+' : itemCount}
                    </motion.span>
                  )}
                </div>
                <span className={`text-[10px] tracking-wider font-medium ${
                  active ? 'text-gold' : 'text-charcoal/40'
                }`}>{label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
