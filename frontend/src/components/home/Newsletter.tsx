'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Mail } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <section className="py-16 md:py-24 bg-white relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gold/5 rounded-full blur-[150px]" />

      <div className="relative z-10 max-w-2xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-gold text-sm tracking-[0.3em] uppercase mb-4 font-medium">İlham Alın</p>
          <h2 className="text-4xl md:text-5xl font-light text-charcoal tracking-tight mb-6">
            Bülletenə Abunə Olun
          </h2>
          <p className="text-charcoal/50 text-sm max-w-md mx-auto mb-8 leading-relaxed">
            Yeni gələnləri, xüsusi təklifləri və lüks ətir yeniliklərini ilk kəşf edən siz olun.
          </p>

          {subscribed ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-gold text-sm tracking-wider"
            >
              <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-3">
                <Mail size={20} className="text-gold" />
              </div>
              Abunə olduğunuz üçün təşəkkürlər! Emailinizi yoxlayın.
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email daxil edin"
                required
                className="flex-1 bg-cream-dark border border-warm-gray rounded-full px-6 py-3.5 text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:border-gold transition-colors text-sm"
              />
              <Button type="submit" variant="gold" size="md">
                Abunə Ol
              </Button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
