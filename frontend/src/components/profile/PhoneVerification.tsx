'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, ShieldCheck, RefreshCw } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import { useAuth } from '@/store/authContext';
import api from '@/lib/api';

interface PhoneVerificationProps {
  onVerified: () => void;
}

export default function PhoneVerification({ onVerified }: PhoneVerificationProps) {
  const { user, updateUser } = useAuth();
  const { showToast } = useToast();
  const [phone, setPhone] = useState(user?.phone || '');
  const [otpSent, setOtpSent] = useState(false);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const formatPhone = (val: string) => {
    const digits = val.replace(/\D/g, '');
    if (!digits.startsWith('994')) return '+994';
    let formatted = '+994';
    if (digits.length > 3) formatted += ' ' + digits.slice(3, 5);
    if (digits.length > 5) formatted += ' ' + digits.slice(5, 8);
    if (digits.length > 8) formatted += ' ' + digits.slice(8, 10);
    if (digits.length > 10) formatted += ' ' + digits.slice(10, 12);
    return formatted;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val.startsWith('+994') || val === '+') {
      setPhone(formatPhone(val));
    } else {
      setPhone('+994');
    }
  };

  const handleSendOTP = async () => {
    const cleaned = phone.replace(/\s/g, '');
    if (cleaned.length !== 13) {
      showToast('error', 'Düzgün nömrə daxil edin (+994 XX XXX XX XX)');
      return;
    }
    setLoading(true);
    try {
      await api.post('/auth/send-otp', { phone: cleaned });
      setOtpSent(true);
      showToast('success', 'Təsdiq kodu emailinizə göndərildi');
      setCountdown(300);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) { clearInterval(timer); return 0; }
          return prev - 1;
        });
      }, 1000);
    } catch { showToast('error', 'Kod göndərilmədi'); }
    finally { setLoading(false); }
  };

  const handleVerifyOTP = async () => {
    if (code.length !== 6) { showToast('error', '6 rəqəmli kodu daxil edin'); return; }
    setLoading(true);
    try {
      await api.post('/auth/verify-otp', { phone: phone.replace(/\s/g, ''), code });
      showToast('success', 'Nömrə təsdiqləndi');
      updateUser({ ...user!, phone: phone.replace(/\s/g, ''), phoneVerified: true });
      onVerified();
    } catch { showToast('error', 'Yanlış kod'); }
    finally { setLoading(false); }
  };

  return (
    <div className="bg-cream-dark rounded-2xl border border-warm-gray p-6 space-y-4">
      <h3 className="text-charcoal font-light flex items-center gap-2">
        <ShieldCheck size={18} className="text-gold" />
        Telefon Təsdiqləmə
      </h3>
      {user?.phoneVerified ? (
        <div className="flex items-center gap-2 text-green-400 text-sm">
          <ShieldCheck size={16} />
          {user.phone} - Təsdiqlənib
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <Input
                label="Mobil nömrə"
                value={phone}
                onChange={handlePhoneChange}
                placeholder="+994 XX XXX XX XX"
                icon={<Phone size={16} />}
              />
            </div>
            {!otpSent && (
              <Button variant="gold" size="sm" onClick={handleSendOTP} loading={loading} disabled={phone.replace(/\s/g, '').length !== 13}>
                Kod Göndər
              </Button>
            )}
          </div>
          {otpSent && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-4">
              <div className="flex items-end gap-3">
                <div className="flex-1">
                  <Input label="Təsdiq kodu" value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="6 rəqəmli kod" />
                </div>
                <Button variant="gold" size="sm" onClick={handleVerifyOTP} loading={loading} disabled={code.length !== 6}>
                  Təsdiq Et
                </Button>
              </div>
              <div className="flex items-center justify-between">
                {countdown > 0 ? (
                  <span className="text-xs text-charcoal/30">Kodun müddəti: {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}</span>
                ) : (
                  <button onClick={handleSendOTP} className="flex items-center gap-1 text-xs text-gold hover:text-gold-dark transition-colors cursor-pointer">
                    <RefreshCw size={12} /> Yenidən kod göndər
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}
