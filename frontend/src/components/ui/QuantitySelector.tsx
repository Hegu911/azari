'use client';

import { motion } from 'framer-motion';
import { Minus, Plus } from 'lucide-react';

interface QuantitySelectorProps {
  quantity: number;
  onChange: (quantity: number) => void;
  min?: number;
  max?: number;
}

export default function QuantitySelector({ quantity, onChange, min = 1, max = 99 }: QuantitySelectorProps) {
  return (
    <div className="flex items-center gap-3 bg-white/5 rounded-xl border border-white/10 p-1">
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => quantity > min && onChange(quantity - 1)}
        className="w-10 h-10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer disabled:opacity-30"
        disabled={quantity <= min}
      >
        <Minus size={16} />
      </motion.button>
      <span className="w-8 text-center text-white font-medium">{quantity}</span>
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => quantity < max && onChange(quantity + 1)}
        className="w-10 h-10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer disabled:opacity-30"
        disabled={quantity >= max}
      >
        <Plus size={16} />
      </motion.button>
    </div>
  );
}
