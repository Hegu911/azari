'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Trash2 } from 'lucide-react';
import { CartItem as CartItemType } from '@/types';
import { formatPrice } from '@/lib/utils';
import QuantitySelector from '@/components/ui/QuantitySelector';
import { useCart } from '@/store/cartContext';

export default function CartItem({ item }: { item: CartItemType }) {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="flex gap-4 p-4 bg-cream-dark rounded-2xl border border-warm-gray"
    >
      <Link href={`/product/${item.product.slug}`} className="shrink-0">
        <div className="w-24 h-24 rounded-xl overflow-hidden bg-warm-gray-light">
          <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${item.product.image || '/images/placeholder.svg'})` }} />
        </div>
      </Link>
      <div className="flex-1 min-w-0">
        <Link href={`/product/${item.product.slug}`}>
          <p className="text-charcoal/40 text-xs tracking-wider uppercase mb-0.5">{item.product.brand?.name}</p>
          <h3 className="text-charcoal font-light text-sm truncate">{item.product.name}</h3>
        </Link>
        <p className="text-gold text-sm mt-1">{formatPrice(item.product.price)}</p>
        <div className="flex items-center justify-between mt-3">
          <QuantitySelector quantity={item.quantity} onChange={(q) => updateQuantity(item.id, q)} />
          <button onClick={() => removeFromCart(item.id)} className="text-charcoal/20 hover:text-red-400 transition-colors cursor-pointer p-1">
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
