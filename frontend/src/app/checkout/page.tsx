'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { MessageSquareText } from 'lucide-react';
import { useCart } from '@/store/cartContext';
import { useAuth } from '@/store/authContext';
import { useToast } from '@/components/ui/Toast';
import { ordersAPI } from '@/lib/api';
import ShippingForm from '@/components/checkout/ShippingForm';
import CheckoutOrderSummary from '@/components/checkout/OrderSummary';
import Button from '@/components/ui/Button';

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  const [shipping, setShipping] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  if (!cart?.items?.length && typeof window !== 'undefined') {
    router.push('/cart');
    return null;
  }

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!shipping.fullName) newErrors.fullName = 'Tələb olunur';
    if (!shipping.email) newErrors.email = 'Tələb olunur';
    if (!shipping.phone) newErrors.phone = 'Tələb olunur';
    if (!shipping.address) newErrors.address = 'Tələb olunur';
    if (!shipping.city) newErrors.city = 'Tələb olunur';
    if (!shipping.postalCode) newErrors.postalCode = 'Tələb olunur';
    if (!shipping.country) newErrors.country = 'Tələb olunur';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (!user) {
      showToast('error', 'Sifariş vermək üçün daxil olun');
      router.push('/login');
      return;
    }

    setLoading(true);
    try {
      const shippingStr = `${shipping.fullName}, ${shipping.address}, ${shipping.city}, ${shipping.postalCode}, ${shipping.country}, Tel: ${shipping.phone}, Email: ${shipping.email}`;
      await ordersAPI.create({ shippingAddress: shippingStr, paymentMethod: 'admin_message' });
      showToast('success', 'Sifarişiniz qəbul edildi! Admin panelə baxın.');
      await clearCart();
      router.push('/');
    } catch {
      showToast('error', 'Sifariş tamamlanmadı');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-16 pb-24 md:pt-24 md:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-light text-charcoal tracking-tight">Sifarişin Tamamlanması</h1>
        </motion.div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <ShippingForm data={shipping} onChange={setShipping} errors={errors} />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-cream-dark rounded-2xl border border-warm-gray p-6 space-y-4"
              >
                <h3 className="text-lg font-light text-charcoal tracking-wide">Ödəniş Məlumatı</h3>
                <div className="flex items-start gap-3 p-4 bg-gold/5 rounded-xl border border-gold/20">
                  <MessageSquareText size={20} className="text-gold mt-0.5 shrink-0" />
                  <div>
                    <p className="text-charcoal/80 text-sm font-medium">Admin ilə əlaqə</p>
                    <p className="text-charcoal/40 text-xs mt-1 leading-relaxed">
                      Sifarişiniz qeydə alındıqdan sonra admin paneldə mesaj olaraq görünəcək. 
                      Admin sizinlə əlaqə saxlayaraq ödəniş detallarını və çatdırılma məlumatlarını təqdim edəcək.
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Button type="submit" variant="gold" fullWidth size="lg" loading={loading}>
                  Sifarişi Göndər
                </Button>
              </motion.div>
            </div>

            <div className="lg:col-span-2">
              <div className="sticky top-28">
                <CheckoutOrderSummary />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
