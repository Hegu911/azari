'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/store/authContext';
import { User, Mail, Phone, MapPin, LogOut, Edit2, Save, X, Package, ChevronRight, Clock, ShieldCheck } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '@/components/ui/Toast';
import { authAPI, ordersAPI } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import PhoneVerification from '@/components/profile/PhoneVerification';

interface Order {
  id: number;
  orderNumber: string;
  status: string;
  total: number;
  createdAt: string;
  items: { quantity: number; price: number; product: { name: string; image?: string } }[];
}

export default function ProfilePage() {
  const { user, logout, updateUser } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '' });
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setForm({ name: user.name || '', email: user.email || '', phone: user.phone || '', address: user.address || '' });
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const { data } = await ordersAPI.getAll();
      setOrders(data);
    } catch {} finally { setOrdersLoading(false); }
  };

  const handleSave = async () => {
    try {
      const { data } = await authAPI.updateProfile({ name: form.name, phone: form.phone, address: form.address });
      updateUser(data);
      setEditing(false);
      showToast('success', 'Profil yeniləndi');
    } catch {
      showToast('error', 'Profil yenilənmədi');
    }
  };

  const handleLogout = () => { logout(); router.push('/'); };

  if (!user) {
    return (
      <div className="pt-16 pb-24 md:pt-24 md:pb-16 text-center">
        <h1 className="text-2xl font-light text-charcoal/50 mb-4">Profilə baxmaq üçün daxil olun</h1>
        <Link href="/login" className="text-gold hover:text-gold-dark transition-colors">Daxil Ol</Link>
      </div>
    );
  }

  const statusColor: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-600',
    processing: 'bg-purple-100 text-purple-600',
    shipped: 'bg-blue-100 text-blue-600',
    delivered: 'bg-green-100 text-green-600',
    cancelled: 'bg-red-100 text-red-600',
  };

  const statusLabel: Record<string, string> = {
    pending: 'Gözləmədə', processing: 'Emal edilir', shipped: 'Göndərildi',
    delivered: 'Çatdırıldı', cancelled: 'Ləğv edildi',
  };

  return (
    <div className="pt-16 pb-24 md:pt-24 md:pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl md:text-4xl font-light text-charcoal tracking-tight mb-8">Profilim</h1>

          <div className="bg-cream-dark rounded-2xl border border-warm-gray p-8 space-y-6">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-16 h-16 rounded-full bg-gold/20 flex items-center justify-center shrink-0">
                  <span className="text-2xl text-gold font-light">
                    {user.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)}
                  </span>
                </div>
                <div className="min-w-0">
                  <h2 className="text-xl font-light text-charcoal truncate">{user.name}</h2>
                  <p className="text-charcoal/40 text-sm">{user.role === 'admin' ? 'Administrator' : 'Müştəri'}</p>
                </div>
              </div>
              <button onClick={() => editing ? setEditing(false) : setEditing(true)} className="flex items-center gap-2 text-sm text-charcoal/40 hover:text-gold transition-colors cursor-pointer shrink-0">
                {editing ? <><X size={14} /> Ləğv Et</> : <><Edit2 size={14} /> Redaktə Et</>}
              </button>
            </div>

            {editing ? (
              <div className="space-y-4 pt-4 border-t border-warm-gray">
                <Input label="Ad Soyad" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                <Input label="E-poçt" value={form.email} disabled />
                <Input label="Telefon" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+994 XX XXX XX XX" />
                <Input label="Ünvan" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
                <Button variant="gold" onClick={handleSave}><Save size={16} /> Yadda Saxla</Button>
              </div>
            ) : (
              <div className="space-y-4 pt-4 border-t border-warm-gray">
                <div className="flex items-center gap-3"><Mail size={16} className="text-charcoal/30" /><span className="text-charcoal/50 text-sm">{user.email}</span></div>
                <div className="flex items-center gap-3"><Phone size={16} className="text-charcoal/30" /><span className="text-charcoal/50 text-sm">{user.phone || 'Əlavə edilməyib'}</span></div>
                <div className="flex items-center gap-3"><MapPin size={16} className="text-charcoal/30" /><span className="text-charcoal/50 text-sm">{user.address || 'Əlavə edilməyib'}</span></div>
              </div>
            )}

            <div className="pt-4 border-t border-warm-gray flex justify-between items-center">
              <Button variant="secondary" onClick={handleLogout} className="!text-red-400 !border-red-400/30"><LogOut size={16} /> Çıxış</Button>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h2 className="text-2xl font-light text-charcoal tracking-tight mb-6 flex items-center gap-2">
            <Package size={20} className="text-charcoal/40" /> Sifarişlərim
          </h2>

          <div className="bg-cream-dark rounded-2xl border border-warm-gray overflow-hidden">
            {ordersLoading ? (
              <div className="p-8 space-y-4">
                {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-14 bg-cream-dark rounded-xl animate-pulse" />)}
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-12">
                <Package size={24} className="text-charcoal/10 mx-auto mb-3" />
                <p className="text-charcoal/30 text-sm">Hələ sifarişiniz yoxdur</p>
                <Link href="/shop" className="text-gold text-sm mt-2 inline-block hover:text-gold-dark transition-colors">Mağazaya keç</Link>
              </div>
            ) : (
              <div className="divide-y divide-warm-gray">
                {orders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 hover:bg-cream-dark transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-charcoal text-sm font-medium truncate">{order.orderNumber}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] shrink-0 ${statusColor[order.status] || 'bg-cream-dark text-charcoal/40'}`}>
                          {statusLabel[order.status] || order.status}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                        <span className="text-charcoal/40 text-xs">{order.items?.length || 0} məhsul</span>
                        <span className="text-charcoal/40 text-xs"><Clock size={10} className="inline mr-1" />{new Date(order.createdAt).toLocaleDateString('az-AZ')}</span>
                        <span className="text-gold text-xs">{formatPrice(parseFloat(order.total.toString()))}</span>
                      </div>
                    </div>
                    <ChevronRight size={14} className="text-charcoal/20 shrink-0" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
