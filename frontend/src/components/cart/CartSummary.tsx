'use client';

import { motion } from 'framer-motion';
import { formatPrice } from '@/lib/utils';
import Button from '@/components/ui/Button';
import { useCart } from '@/store/cartContext';

interface CartSummaryProps {
  onCheckout: () => void;
}

export default function CartSummary({ onCheckout }: CartSummaryProps) {
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
      <h3 className="text-charcoal font-light tracking-wide">Sifariş Xülasəsi</h3>
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-charcoal/40">Ara Cəmi</span>
          <span className="text-charcoal">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-charcoal/40">Çatdırılma</span>
          <span className="text-charcoal">{shipping === 0 ? 'Pulsuz' : formatPrice(shipping)}</span>
        </div>
        {subtotal < 200 && subtotal > 0 && (
          <p className="text-xs text-gold/70">200 AZN üzəri sifarişlərdə pulsuz çatdırılma</p>
        )}
        <div className="border-t border-warm-gray pt-3 flex justify-between">
          <span className="text-charcoal font-light">Cəmi</span>
          <span className="text-charcoal text-lg font-light">{formatPrice(total)}</span>
        </div>
      </div>
      <Button variant="gold" fullWidth onClick={onCheckout} disabled={!cart?.items?.length}>
        Sifarişi Tamamla
      </Button>
    </motion.div>
  );
}
