'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Mail, ArrowLeft } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSent(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-white to-cream-dark flex items-center justify-center px-4">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gold/5 rounded-full blur-[150px]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-white border border-warm-gray rounded-3xl p-8 shadow-xl shadow-black/5">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-light text-charcoal tracking-tight mb-2">Şifrəni Sıfırla</h1>
            <p className="text-charcoal/40 text-sm">
              {sent ? 'Emailinizi yoxlayın' : 'Şifrə sıfırlama təlimatları üçün email daxil edin'}
            </p>
          </div>

          {sent ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                <Mail size={24} className="text-green-600" />
              </div>
              <p className="text-charcoal/50 text-sm mb-6">{email} ünvanına şifrə sıfırlama linki göndərdik</p>
              <Link href="/login" className="text-gold text-sm hover:text-gold-dark transition-colors">
                Girişə Qayıt
              </Link>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="E-poçt"
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<Mail size={16} />}
                required
              />
              <Button type="submit" variant="gold" fullWidth>
                Sıfırlama Linki Göndər
              </Button>
              <div className="text-center">
                <Link href="/login" className="inline-flex items-center gap-1 text-sm text-charcoal/40 hover:text-gold transition-colors">
                  <ArrowLeft size={14} /> Girişə Qayıt
                </Link>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
