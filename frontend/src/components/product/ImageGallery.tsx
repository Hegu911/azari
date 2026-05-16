'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ImageGalleryProps {
  images: string[];
  name: string;
}

export default function ImageGallery({ images, name }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const displayImages = images.length > 0 ? images : ['/images/placeholder.svg'];

  return (
    <div className="space-y-4">
      <motion.div
        key={selectedIndex}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="relative aspect-square rounded-3xl overflow-hidden bg-warm-gray-light group"
      >
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-700 group-hover:scale-105"
          style={{ backgroundImage: `url(${displayImages[selectedIndex]})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/10 to-transparent" />
      </motion.div>
      {displayImages.length > 1 && (
        <div className="flex gap-3">
          {displayImages.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelectedIndex(i)}
              className={`relative w-20 h-20 rounded-xl overflow-hidden transition-all duration-300 cursor-pointer ${
                i === selectedIndex ? 'ring-2 ring-gold ring-offset-2 ring-offset-cream' : 'opacity-50 hover:opacity-80'
              }`}
            >
              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${img})` }} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
