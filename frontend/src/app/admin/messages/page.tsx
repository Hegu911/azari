'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Package, User, MapPin, Phone, Mail, ChevronRight, Clock } from 'lucide-react';
import api from '@/lib/api';

export default function AdminMessages() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const adminHeaders = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` } });

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/orders', {
        params: { page: 1, status: 'all' },
        ...adminHeaders(),
      });
      setOrders(data.orders);
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => { fetchMessages(); }, []);

  const viewDetail = async (id: number) => {
    try {
      const { data } = await api.get(`/admin/orders/${id}`, adminHeaders());
      setSelectedOrder(data);
    } catch {}
  };

  const parseShipping = (str?: string) => {
    if (!str) return {};
    const parts = str.split(', ');
    const obj: Record<string, string> = {};
    parts.forEach((p: string) => {
      if (p.startsWith('Tel: ')) obj.phone = p.replace('Tel: ', '');
      else if (p.startsWith('Email: ')) obj.email = p.replace('Email: ', '');
      else if (!obj.fullName) obj.fullName = p;
      else if (!obj.address) obj.address = p;
      else if (!obj.city) obj.city = p;
      else if (!obj.postalCode) obj.postalCode = p;
      else if (!obj.country) obj.country = p;
    });
    return obj;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-light text-white">Mesajlar</h1>
        <p className="text-white/30 text-sm">Müştərilərdən gələn sifariş mesajları</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Message List */}
        <div className="lg:col-span-1 bg-white/5 rounded-2xl border border-white/5 overflow-hidden">
          {loading ? (
            <div className="p-4 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-16 bg-white/5 rounded-xl animate-pulse" />)}
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12 text-white/30 text-sm">Mesaj yoxdur</div>
          ) : (
            <div className="divide-y divide-white/5">
              {orders.map((order) => (
                <button
                  key={order.id}
                  onClick={() => viewDetail(order.id)}
                  className={`w-full text-left p-4 hover:bg-white/5 transition-colors cursor-pointer ${
                    selectedOrder?.id === order.id ? 'bg-white/5' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      order.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400' :
                      order.status === 'processing' ? 'bg-purple-500/10 text-purple-400' :
                      order.status === 'shipped' ? 'bg-blue-500/10 text-blue-400' :
                      order.status === 'delivered' ? 'bg-green-500/10 text-green-400' :
                      'bg-red-500/10 text-red-400'
                    }`}>
                      <MessageSquare size={14} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-white/80 text-sm font-medium truncate">{order.user?.name || 'Müştəri'}</p>
                        <span className="text-white/20 text-[10px]">{new Date(order.createdAt).toLocaleDateString('az-AZ')}</span>
                      </div>
                      <p className="text-white/40 text-xs mt-0.5 truncate">{order.orderNumber}</p>
                      <p className="text-white/30 text-[10px] mt-1">
                        {order.items?.length || 0} məhsul · {parseFloat(order.total).toFixed(2)} AZN
                      </p>
                    </div>
                    <ChevronRight size={14} className="text-white/20 mt-2 shrink-0" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-2">
          {selectedOrder ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white/5 rounded-2xl border border-white/5 p-6 space-y-6"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/5">
                <div>
                  <h2 className="text-white font-light">Sifariş #{selectedOrder.orderNumber}</h2>
                  <p className="text-white/30 text-xs mt-1">
                    <Clock size={12} className="inline mr-1" />
                    {new Date(selectedOrder.createdAt).toLocaleString('az-AZ')}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] ${
                  selectedOrder.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400' :
                  selectedOrder.status === 'delivered' ? 'bg-green-500/10 text-green-400' :
                  selectedOrder.status === 'cancelled' ? 'bg-red-500/10 text-red-400' :
                  'bg-blue-500/10 text-blue-400'
                }`}>
                  {selectedOrder.status === 'pending' ? 'Gözləmədə' :
                   selectedOrder.status === 'processing' ? 'Emal edilir' :
                   selectedOrder.status === 'shipped' ? 'Göndərildi' :
                   selectedOrder.status === 'delivered' ? 'Çatdırıldı' : 'Ləğv edildi'}
                </span>
              </div>

              {/* Customer */}
              <div className="space-y-3">
                <h3 className="text-xs text-white/40 tracking-wider uppercase flex items-center gap-2">
                  <User size={12} /> Müştəri
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 text-sm text-white/70">
                    <User size={14} className="text-white/30 shrink-0" /> {selectedOrder.user?.name}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-white/70">
                    <Mail size={14} className="text-white/30 shrink-0" /> {selectedOrder.user?.email}
                  </div>
                  {selectedOrder.user?.phone && (
                    <div className="flex items-center gap-2 text-sm text-white/70">
                      <Phone size={14} className="text-white/30 shrink-0" /> {selectedOrder.user.phone}
                    </div>
                  )}
                </div>
              </div>

              {/* Shipping */}
              <div className="space-y-3">
                <h3 className="text-xs text-white/40 tracking-wider uppercase flex items-center gap-2">
                  <MapPin size={12} /> Çatdırılma Ünvanı
                </h3>
                <div className="text-sm text-white/60 leading-relaxed bg-black/30 rounded-xl p-4">
                  {parseShipping(selectedOrder.shippingAddress).fullName && <p>{parseShipping(selectedOrder.shippingAddress).fullName}</p>}
                  {parseShipping(selectedOrder.shippingAddress).address && <p>{parseShipping(selectedOrder.shippingAddress).address}</p>}
                  {parseShipping(selectedOrder.shippingAddress).city && <p>{parseShipping(selectedOrder.shippingAddress).city}{parseShipping(selectedOrder.shippingAddress).postalCode ? `, ${parseShipping(selectedOrder.shippingAddress).postalCode}` : ''}</p>}
                  {parseShipping(selectedOrder.shippingAddress).country && <p>{parseShipping(selectedOrder.shippingAddress).country}</p>}
                  {parseShipping(selectedOrder.shippingAddress).phone && <p className="mt-1">Tel: {parseShipping(selectedOrder.shippingAddress).phone}</p>}
                  {parseShipping(selectedOrder.shippingAddress).email && <p>Email: {parseShipping(selectedOrder.shippingAddress).email}</p>}
                </div>
              </div>

              {/* Items */}
              <div className="space-y-3">
                <h3 className="text-xs text-white/40 tracking-wider uppercase flex items-center gap-2">
                  <Package size={12} /> Sifariş Edilən Məhsullar
                </h3>
                <div className="space-y-2">
                  {selectedOrder.items?.map((item: any) => (
                    <div key={item.id} className="flex items-center gap-3 p-3 bg-black/30 rounded-xl">
                      <div className="w-12 h-12 rounded-lg bg-[#111] bg-cover bg-center shrink-0" style={{ backgroundImage: `url(${item.product?.image || '/images/placeholder.svg'})` }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm truncate">{item.product?.name}</p>
                        <p className="text-white/40 text-xs">Say: {item.quantity} × {parseFloat(item.price).toFixed(2)} AZN</p>
                      </div>
                      <p className="text-white/80 text-sm">{(item.quantity * parseFloat(item.price)).toFixed(2)} AZN</p>
                    </div>
                  ))}
                </div>
                <div className="border-t border-white/5 pt-3 flex justify-between">
                  <span className="text-white font-light text-sm">Ümumi Cəmi</span>
                  <span className="text-white text-lg font-light">{parseFloat(selectedOrder.total).toFixed(2)} AZN</span>
                </div>
              </div>

              {/* Payment Info */}
              <div className="bg-[#d4af37]/5 rounded-xl border border-[#d4af37]/20 p-4 space-y-2">
                <div className="flex items-start gap-3">
                  <MessageSquare size={16} className="text-[#d4af37] mt-0.5 shrink-0" />
                  <div>
                    <p className="text-white/80 text-sm font-medium">Ödəniş tələbi</p>
                    <p className="text-white/40 text-xs mt-1">
                      Bu sifariş admin vasitəsilə ödəniləcək. Müştəri ilə əlaqə saxlayaraq 
                      ödəniş üsulu və çatdırılma detallarını təqdim edin.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="bg-white/5 rounded-2xl border border-white/5 p-12 flex flex-col items-center justify-center text-center">
              <MessageSquare size={32} className="text-white/10 mb-4" />
              <p className="text-white/30 text-sm">Mesajı görmək üçün soldan seçin</p>
              <p className="text-white/20 text-xs mt-1">Yeni sifarişlər avtomatik olaraq mesaj kimi görünür</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}