'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Mail, Lock, User, Eye, EyeOff, Phone, ShieldCheck, RefreshCw } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useAuth } from '@/store/authContext';
import { useToast } from '@/components/ui/Toast';
import { authAPI } from '@/lib/api';

export default function RegisterForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('+994');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [code, setCode] = useState('');
  const [countdown, setCountdown] = useState(0);
  const { register, completeRegistration } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) { setError('Şifrələr uyğun gəlmir'); return; }
    if (password.length < 6) { setError('Şifrə ən az 6 simvol olmalıdır'); return; }
    const cleanedPhone = phone.replace(/\s/g, '');
    if (cleanedPhone.length !== 13) { setError('Düzgün nömrə daxil edin (+994 XX XXX XX XX)'); return; }

    setLoading(true);
    try {
      await register(name, email, password, cleanedPhone);
      await authAPI.sendOTPRegister({ email });
      setStep('otp');
      showToast('success', 'Təsdiq kodu emailinizə göndərildi');
      setCountdown(300);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) { clearInterval(timer); return 0; }
          return prev - 1;
        });
      }, 1000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Qeydiyyat uğursuz oldu');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (code.length !== 6) { showToast('error', '6 rəqəmli kodu daxil edin'); return; }
    setLoading(true);
    try {
      await completeRegistration(email, code);
      showToast('success', 'Hesab uğurla təsdiqləndi!');
      router.push('/');
    } catch { showToast('error', 'Yanlış kod'); }
    finally { setLoading(false); }
  };

  const handleResend = async () => {
    try {
      await authAPI.sendOTPRegister({ email });
      showToast('success', 'Yeni kod göndərildi');
      setCountdown(300);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) { clearInterval(timer); return 0; }
          return prev - 1;
        });
      }, 1000);
    } catch { showToast('error', 'Kod göndərilmədi'); }
  };

  if (step === 'otp') {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-[#d4af37]/10 flex items-center justify-center mx-auto mb-4">
            <ShieldCheck size={28} className="text-[#d4af37]" />
          </div>
          <h1 className="text-2xl font-light text-charcoal tracking-tight mb-2">Təsdiq kodu</h1>
          <p className="text-charcoal/40 text-sm">{email} ünvanına kod göndərildi</p>
        </div>

        <div>
          <Input label="6 rəqəmli kod" value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="000000" />
        </div>

        <Button type="button" variant="gold" fullWidth loading={loading} disabled={code.length !== 6} onClick={handleVerify}>
          Təsdiq Et
        </Button>

        <div className="text-center">
          {countdown > 0 ? (
            <span className="text-xs text-charcoal/30">Yenidən göndərmək üçün: {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}</span>
          ) : (
            <button onClick={handleResend} className="flex items-center gap-1 text-xs text-gold hover:text-gold-dark transition-colors cursor-pointer mx-auto">
              <RefreshCw size={12} /> Yenidən kod göndər
            </button>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-light text-charcoal tracking-tight mb-2">Hesab Yarat</h1>
        <p className="text-charcoal/40 text-sm">Lüks ətirlər dünyasına qoşulun</p>
      </div>

      {error && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-600 text-xs text-center">
          {error}
        </motion.div>
      )}

      <Input label="Ad Soyad" placeholder="Ad Soyad" value={name} onChange={(e) => setName(e.target.value)} icon={<User size={16} />} required />
      <Input label="E-poçt" type="email" placeholder="email@example.com" value={email} onChange={(e) => setEmail(e.target.value)} icon={<Mail size={16} />} required />
      <Input label="Mobil nömrə" value={phone} onChange={handlePhoneChange} placeholder="+994 XX XXX XX XX" icon={<Phone size={16} />} required />
      <div className="relative">
        <Input label="Şifrə" type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} icon={<Lock size={16} />} required />
        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-[38px] text-charcoal/30 hover:text-charcoal cursor-pointer">
          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
      <Input label="Şifrəni Təsdiqlə" type="password" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} icon={<Lock size={16} />} required />

      <Button type="submit" variant="gold" fullWidth loading={loading}>
        Qeydiyyatdan Keç
      </Button>

      <p className="text-center text-sm text-charcoal/40">
        Artıq hesabınız var?{' '}
        <Link href="/login" className="text-gold hover:text-gold-dark transition-colors">
          Daxil Ol
        </Link>
      </p>
    </motion.form>
  );
}
