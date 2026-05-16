'use client';

import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ShoppingBag, ArrowLeft } from 'lucide-react';
import { useCart } from '@/store/cartContext';
import CartItem from '@/components/cart/CartItem';
import CartSummary from '@/components/cart/CartSummary';

export default function CartPage() {
  const { cart } = useCart();
  const router = useRouter();

  return (
    <div className="pt-16 pb-24 md:pt-24 md:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-light text-charcoal tracking-tight">Səbət</h1>
          <p className="text-charcoal/40 text-sm mt-1">{cart?.items?.length || 0} məhsul</p>
        </motion.div>

        {!cart?.items?.length ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-cream-dark flex items-center justify-center">
              <ShoppingBag size={24} className="text-charcoal/20" />
            </div>
            <h3 className="text-xl font-light text-charcoal/50 mb-2">Səbətiniz boşdur</h3>
            <p className="text-charcoal/30 text-sm mb-6">Lüks ətir kolleksiyamızı kəşf edin</p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-8 py-3 bg-gold text-black rounded-full text-sm font-medium hover:bg-gold-dark transition-colors"
            >
              <ArrowLeft size={16} />
              Məhsullara Bax
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <AnimatePresence mode="popLayout">
                {cart.items.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </AnimatePresence>
            </div>
            <div>
              <CartSummary onCheckout={() => router.push('/checkout')} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
