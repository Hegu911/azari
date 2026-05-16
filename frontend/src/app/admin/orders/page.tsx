'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';
import { X, Eye, Package, User, MapPin, Phone, Mail, CreditCard } from 'lucide-react';

const statuses = ['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const adminHeaders = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` } });

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/orders', { params: { page, status }, ...adminHeaders() });
      setOrders(data.orders);
      setTotal(data.total);
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => { fetchOrders(); }, [page, status]);

  const updateStatus = async (id: number, newStatus: string) => {
    try {
      await api.put(`/admin/orders/${id}/status`, { status: newStatus }, adminHeaders());
      fetchOrders();
      if (selectedOrder?.id === id) setSelectedOrder((prev: any) => prev ? { ...prev, status: newStatus } : prev);
    } catch {}
  };

  const viewDetail = async (id: number) => {
    setDetailLoading(true);
    try {
      const { data } = await api.get(`/admin/orders/${id}`, adminHeaders());
      setSelectedOrder(data);
    } catch {} finally { setDetailLoading(false); }
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
        <h1 className="text-2xl font-light text-white">Sifarişlər</h1>
        <p className="text-white/30 text-sm">{total} sifariş</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {statuses.map((s) => (
          <button key={s} onClick={() => { setStatus(s); setPage(1); }}
            className={`px-4 py-2 rounded-xl text-xs capitalize transition-all cursor-pointer ${
              status === s ? 'bg-[#d4af37] text-black' : 'bg-white/5 text-white/40 hover:bg-white/10'
            }`}>
            {s === 'all' ? 'Hamısı' : s === 'pending' ? 'Gözləmədə' : s === 'processing' ? 'Emal edilir' : s === 'shipped' ? 'Göndərildi' : s === 'delivered' ? 'Çatdırıldı' : 'Ləğv edildi'}
          </button>
        ))}
      </div>

      <div className="bg-white/5 rounded-2xl border border-white/5 overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-12 bg-white/5 rounded-xl animate-pulse" />)}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12 text-white/30 text-sm">Sifariş tapılmadı</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 text-white/40 text-xs uppercase tracking-wider">
                  <th className="text-left p-4 font-normal">Sifariş #</th>
                  <th className="text-left p-4 font-normal">Müştəri</th>
                  <th className="text-left p-4 font-normal">Məhsullar</th>
                  <th className="text-left p-4 font-normal">Cəmi</th>
                  <th className="text-left p-4 font-normal">Status</th>
                  <th className="text-left p-4 font-normal">Ödəniş</th>
                  <th className="text-left p-4 font-normal">Tarix</th>
                  <th className="text-left p-4 font-normal">Ətraflı</th>
                  <th className="text-left p-4 font-normal">İdarə</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-4 text-white/80 font-mono text-xs">{order.orderNumber}</td>
                    <td className="p-4">
                      <div>
                        <p className="text-white/80 text-xs">{order.user?.name}</p>
                        <p className="text-white/30 text-[10px]">{order.user?.email}</p>
                      </div>
                    </td>
                    <td className="p-4 text-white/60 text-xs">{order.items?.length || 0} məhsul</td>
                    <td className="p-4 text-white/80">{parseFloat(order.total).toFixed(2)} AZN</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] capitalize ${
                        order.status === 'delivered' ? 'bg-green-500/10 text-green-400' :
                        order.status === 'shipped' ? 'bg-blue-500/10 text-blue-400' :
                        order.status === 'cancelled' ? 'bg-red-500/10 text-red-400' :
                        order.status === 'processing' ? 'bg-purple-500/10 text-purple-400' :
                        'bg-yellow-500/10 text-yellow-400'
                      }`}>
                        {order.status === 'pending' ? 'Gözləmədə' : order.status === 'processing' ? 'Emal edilir' : order.status === 'shipped' ? 'Göndərildi' : order.status === 'delivered' ? 'Çatdırıldı' : 'Ləğv edildi'}
                      </span>
                    </td>
                    <td className="p-4 text-white/60 text-xs capitalize">{order.paymentStatus === 'paid' ? 'Ödənildi' : 'Gözləmədə'}</td>
                    <td className="p-4 text-white/40 text-xs">{new Date(order.createdAt).toLocaleDateString('az-AZ')}</td>
                    <td className="p-4">
                      <button onClick={() => viewDetail(order.id)} className="p-2 text-white/30 hover:text-[#d4af37] transition-colors cursor-pointer">
                        <Eye size={14} />
                      </button>
                    </td>
                    <td className="p-4">
                      <select value={order.status} onChange={(e) => updateStatus(order.id, e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-white text-xs focus:outline-none focus:border-[#d4af37] cursor-pointer">
                        {statuses.filter(s => s !== 'all').map((s) => (
                          <option key={s} value={s} className="bg-black">
                            {s === 'pending' ? 'Gözləmədə' : s === 'processing' ? 'Emal edilir' : s === 'shipped' ? 'Göndərildi' : s === 'delivered' ? 'Çatdırıldı' : 'Ləğv edildi'}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {total > 20 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: Math.ceil(total / 20) }).map((_, i) => (
            <button key={i} onClick={() => setPage(i + 1)}
              className={`w-8 h-8 rounded-lg text-xs transition-all cursor-pointer ${
                page === i + 1 ? 'bg-[#d4af37] text-black' : 'bg-white/5 text-white/40 hover:bg-white/10'
              }`}>{i + 1}</button>
          ))}
        </div>
      )}

      {/* Order Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-start justify-center pt-10 pb-10 px-4 overflow-y-auto"
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedOrder(null)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative z-10 w-full max-w-3xl bg-[#0a0a0a] border border-white/5 rounded-3xl p-8 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-light text-white">Sifariş #{selectedOrder.orderNumber}</h2>
                <button onClick={() => setSelectedOrder(null)} className="text-white/30 hover:text-white cursor-pointer p-1">
                  <X size={20} />
                </button>
              </div>

              {detailLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-12 bg-white/5 rounded-xl animate-pulse" />)}
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Customer Info */}
                  <div className="bg-white/5 rounded-2xl border border-white/5 p-6 space-y-4">
                    <h3 className="text-sm font-medium text-white/80 tracking-wider uppercase flex items-center gap-2">
                      <User size={14} className="text-[#d4af37]" /> Müştəri Məlumatları
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3">
                        <User size={14} className="text-white/30 shrink-0" />
                        <span className="text-white/70 text-sm">{selectedOrder.user?.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail size={14} className="text-white/30 shrink-0" />
                        <span className="text-white/70 text-sm">{selectedOrder.user?.email}</span>
                      </div>
                      {selectedOrder.user?.phone && (
                        <div className="flex items-center gap-3">
                          <Phone size={14} className="text-white/30 shrink-0" />
                          <span className="text-white/70 text-sm">{selectedOrder.user.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Shipping Info */}
                  <div className="bg-white/5 rounded-2xl border border-white/5 p-6 space-y-4">
                    <h3 className="text-sm font-medium text-white/80 tracking-wider uppercase flex items-center gap-2">
                      <MapPin size={14} className="text-[#d4af37]" /> Çatdırılma Ünvanı
                    </h3>
                    <div className="flex items-start gap-3">
                      <MapPin size={14} className="text-white/30 mt-1 shrink-0" />
                      <div className="text-sm text-white/70 leading-relaxed">
                        {parseShipping(selectedOrder.shippingAddress).fullName && (
                          <p>{parseShipping(selectedOrder.shippingAddress).fullName}</p>
                        )}
                        {parseShipping(selectedOrder.shippingAddress).address && (
                          <p>{parseShipping(selectedOrder.shippingAddress).address}</p>
                        )}
                        {parseShipping(selectedOrder.shippingAddress).city && (
                          <p>{parseShipping(selectedOrder.shippingAddress).city}{parseShipping(selectedOrder.shippingAddress).postalCode ? `, ${parseShipping(selectedOrder.shippingAddress).postalCode}` : ''}</p>
                        )}
                        {parseShipping(selectedOrder.shippingAddress).country && (
                          <p>{parseShipping(selectedOrder.shippingAddress).country}</p>
                        )}
                        {parseShipping(selectedOrder.shippingAddress).phone && (
                          <p className="mt-2">Tel: {parseShipping(selectedOrder.shippingAddress).phone}</p>
                        )}
                        {parseShipping(selectedOrder.shippingAddress).email && (
                          <p>Email: {parseShipping(selectedOrder.shippingAddress).email}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="bg-white/5 rounded-2xl border border-white/5 p-6 space-y-4">
                    <h3 className="text-sm font-medium text-white/80 tracking-wider uppercase flex items-center gap-2">
                      <Package size={14} className="text-[#d4af37]" /> Sifariş Edilən Məhsullar
                    </h3>
                    <div className="space-y-3">
                      {selectedOrder.items?.map((item: any) => (
                        <div key={item.id} className="flex items-center gap-4 p-3 bg-black/30 rounded-xl">
                          <div className="w-14 h-14 rounded-xl bg-[#111] bg-cover bg-center shrink-0" style={{ backgroundImage: `url(${item.product?.image || '/images/placeholder.svg'})` }} />
                          <div className="flex-1 min-w-0">
                            <p className="text-white text-sm truncate">{item.product?.name}</p>
                            <p className="text-white/40 text-xs mt-0.5">Say: {item.quantity} × {parseFloat(item.price).toFixed(2)} AZN</p>
                          </div>
                          <div className="text-right">
                            <p className="text-white/80 text-sm">{(item.quantity * parseFloat(item.price)).toFixed(2)} AZN</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-white/5 pt-4 flex justify-between items-center">
                      <span className="text-white font-light">Ümumi Cəmi</span>
                      <span className="text-white text-xl font-light">{parseFloat(selectedOrder.total).toFixed(2)} AZN</span>
                    </div>
                  </div>

                  {/* Payment Info */}
                  <div className="bg-white/5 rounded-2xl border border-white/5 p-6 space-y-4">
                    <h3 className="text-sm font-medium text-white/80 tracking-wider uppercase flex items-center gap-2">
                      <CreditCard size={14} className="text-[#d4af37]" /> Ödəniş Məlumatı
                    </h3>
                    <div className="flex items-center gap-3 p-3 bg-[#d4af37]/5 rounded-xl border border-[#d4af37]/20">
                      <MessageSquareText size={16} className="text-[#d4af37] shrink-0" />
                      <div>
                        <p className="text-white/70 text-sm">Admin vasitəsilə ödəniş</p>
                        <p className="text-white/40 text-xs mt-0.5">Müştəri ilə əlaqə saxlayaraq ödəniş detallarını təqdim edin</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-white/40 text-xs">Status:</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] ${selectedOrder.paymentStatus === 'paid' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                        {selectedOrder.paymentStatus === 'paid' ? 'Ödənildi' : 'Gözləmədə'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-white/40 text-xs">Sifariş Statusu:</span>
                      <select value={selectedOrder.status} onChange={(e) => updateStatus(selectedOrder.id, e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-white text-xs focus:outline-none focus:border-[#d4af37] cursor-pointer">
                        {statuses.filter(s => s !== 'all').map((s) => (
                          <option key={s} value={s} className="bg-black">
                            {s === 'pending' ? 'Gözləmədə' : s === 'processing' ? 'Emal edilir' : s === 'shipped' ? 'Göndərildi' : s === 'delivered' ? 'Çatdırıldı' : 'Ləğv edildi'}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MessageSquareText(props: any) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}