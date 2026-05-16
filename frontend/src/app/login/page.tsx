'use client';

import { motion } from 'framer-motion';
import LoginForm from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-white to-cream-dark flex items-center justify-center px-4">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gold/5 rounded-full blur-[150px]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-white border border-warm-gray rounded-3xl p-8 shadow-xl shadow-black/5">
          <LoginForm />
        </div>
      </motion.div>
    </div>
  );
}
