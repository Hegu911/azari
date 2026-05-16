'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, Mail, Eye, EyeOff } from 'lucide-react';
import api from '@/lib/api';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const { data } = await api.post('/admin/login', { email, password });
      localStorage.setItem('admin_token', data.token);
      localStorage.setItem('admin', JSON.stringify(data.admin));
      router.push('/admin');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#1a1a1a_0%,_#000000_100%)]" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#d4af37]/5 rounded-full blur-[150px]" />
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative z-10 w-full max-w-md">
        <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-8 backdrop-blur-xl">
          <div className="text-center mb-8">
            <img src="/logo.png" alt="Azari Parfumes" className="h-10 w-auto mx-auto mb-2" />
            <p className="text-white/30 text-xs">Admin Panel</p>
          </div>
          {error && <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-red-400 text-xs text-center mb-4">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input label="Email" type="email" placeholder="admin@azariparfumes.az" value={email} onChange={(e) => setEmail(e.target.value)} icon={<Mail size={16} />} required />
            <div className="relative">
              <Input label="Password" type={show ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} icon={<Lock size={16} />} required />
              <button type="button" onClick={() => setShow(!show)} className="absolute right-4 top-[38px] text-white/30 hover:text-white cursor-pointer">{show ? <EyeOff size={16} /> : <Eye size={16} />}</button>
            </div>
            <Button type="submit" variant="gold" fullWidth loading={loading}>Sign In</Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
