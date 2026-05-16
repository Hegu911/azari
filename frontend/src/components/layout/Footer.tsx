'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, Globe, MessageCircle, MessageSquare, Video } from 'lucide-react';

const socialIcons = [Globe, MessageCircle, MessageSquare, Video];

export default function Footer() {
  return (
    <footer className="bg-cream-dark border-t border-warm-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="mb-4">
              <img src="/logo.png" alt="Azari Parfumes" className="h-12 w-auto object-contain" />
            </div>
            <p className="text-charcoal/50 text-sm leading-relaxed">
              İncə ətir sənətini kəşf edin. Kolleksiyamız dünyanın ən lüks ətirlərini bir araya gətirir.
            </p>
            <div className="flex gap-3 mt-5">
              {socialIcons.map((Icon, i) => (
                <motion.a
                  key={i}
                  whileHover={{ y: -2 }}
                  href="#"
                  className="w-9 h-9 rounded-full bg-gold/10 flex items-center justify-center text-gold hover:bg-gold hover:text-white transition-all"
                >
                  <Icon size={15} />
                </motion.a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-charcoal mb-5 tracking-wider uppercase">Keçidlər</h4>
            <div className="space-y-2.5">
              {[
                { label: 'Ana Səhifə', href: '/' },
                { label: 'Bütün Məhsullar', href: '/shop' },
                { label: 'Yeni Gələnlər', href: '/shop?sort=newest' },
                { label: 'Ən Çox Satılanlar', href: '/shop?sort=rating' },
                { label: 'Kolleksiyalar', href: '/shop' },
              ].map((link) => (
                <Link key={link.label} href={link.href} className="block text-sm text-charcoal/50 hover:text-gold transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-charcoal mb-5 tracking-wider uppercase">Dəstək</h4>
            <div className="space-y-2.5">
              {['Bizimlə Əlaqə', 'FAQ', 'Çatdırılma & Geri Qaytarma', 'Ölçü Bələdçisi', 'Məxfilik Siyasəti'].map((item) => (
                <Link key={item} href="#" className="block text-sm text-charcoal/50 hover:text-gold transition-colors">
                  {item}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-charcoal mb-5 tracking-wider uppercase">Əlaqə</h4>
            <div className="space-y-3.5">
              {[
                { icon: MapPin, text: 'Mingəçevir şəhəri, 20 Yanvar 35/38' },
                { icon: Phone, text: '050 600 55 01' },
                { icon: Mail, text: 'info@azariparfumes.az' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <item.icon size={16} className="text-gold mt-0.5 shrink-0" />
                  <span className="text-sm text-charcoal/50">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-warm-gray mt-10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-charcoal/40">© 2026 Azari Parfumes. Bütün hüquqlar qorunur.</p>
          <div className="flex gap-2">
            {['Visa', 'Mastercard', 'Amex', 'PayPal'].map((p) => (
              <span key={p} className="px-3 py-1.5 text-xs text-charcoal/50 bg-cream-dark rounded-md">{p}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
