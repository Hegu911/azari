'use client';

import { motion } from 'framer-motion';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/store/cartContext';

export default function CheckoutOrderSummary() {
  const { cart } = useCart();
  const subtotal = cart?.items?.reduce((sum, item) => sum + item.product.price * item.quantity, 0) || 0;
  const shipping = subtotal >= 200 ? 0 : 15;
  const total = subtotal + shipping;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-cream-dark rounded-2xl border border-warm-gray p-6 space-y-4"
    >
      <h3 className="text-lg font-light text-charcoal tracking-wide">Sifariş Xülasəsi</h3>
      <div className="space-y-3">
        {cart?.items?.map((item) => (
          <div key={item.id} className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg overflow-hidden bg-warm-gray-light shrink-0">
              <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${item.product.image || '/images/placeholder.svg'})` }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-charcoal text-xs truncate">{item.product.name}</p>
              <p className="text-charcoal/40 text-xs">Say: {item.quantity}</p>
            </div>
            <span className="text-charcoal text-sm">{formatPrice(item.product.price * item.quantity)}</span>
          </div>
        ))}
      </div>
      <div className="border-t border-warm-gray pt-3 space-y-2">
        <div className="flex justify-between text-sm"><span className="text-charcoal/40">Ara Cəmi</span><span className="text-charcoal">{formatPrice(subtotal)}</span></div>
        <div className="flex justify-between text-sm"><span className="text-charcoal/40">Çatdırılma</span><span className="text-charcoal">{shipping === 0 ? 'Pulsuz' : formatPrice(shipping)}</span></div>
        <div className="border-t border-warm-gray pt-2 flex justify-between"><span className="text-charcoal font-light">Cəmi</span><span className="text-charcoal text-lg font-light">{formatPrice(total)}</span></div>
      </div>
    </motion.div>
  );
}
