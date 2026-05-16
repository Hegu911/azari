'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useAuth } from '@/store/authContext';
import { useToast } from '@/components/ui/Toast';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      showToast('success', 'Xoş gəldiniz!');
      router.push('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Məlumatlar yanlışdır');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-light text-charcoal tracking-tight mb-2">Xoş Gəldiniz</h1>
        <p className="text-charcoal/40 text-sm">Hesabınıza daxil olun</p>
      </div>

      {error && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-600 text-xs text-center">
          {error}
        </motion.div>
      )}

      <Input
        label="E-poçt"
        type="email"
        placeholder="email@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        icon={<Mail size={16} />}
        required
      />
      <div className="relative">
        <Input
          label="Şifrə"
          type={showPassword ? 'text' : 'password'}
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          icon={<Lock size={16} />}
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-[38px] text-charcoal/30 hover:text-charcoal cursor-pointer"
        >
          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>

      <div className="flex justify-end">
        <Link href="/forgot-password" className="text-xs text-charcoal/40 hover:text-gold transition-colors">
          Şifrəni Unutmusan?
        </Link>
      </div>

      <Button type="submit" variant="gold" fullWidth loading={loading}>
        Daxil Ol
      </Button>

      <p className="text-center text-sm text-charcoal/40">
        Hesabınız yoxdur?{' '}
        <Link href="/register" className="text-gold hover:text-gold-dark transition-colors">
          Qeydiyyat
        </Link>
      </p>
    </motion.form>
  );
}
