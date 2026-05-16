'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, ShoppingCart, Users, DollarSign, TrendingUp, Clock } from 'lucide-react';
import api from '@/lib/api';

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) return;
    api.get('/admin/dashboard', { headers: { Authorization: `Bearer ${token}` } })
      .then(({ data }) => setData(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const stats = [
    { label: 'Total Revenue', value: data ? `$${parseFloat(data.stats.totalRevenue).toLocaleString()}` : '—', icon: DollarSign, color: 'text-green-400', bg: 'bg-green-500/10' },
    { label: 'Total Orders', value: data?.stats.totalOrders || 0, icon: ShoppingCart, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Total Products', value: data?.stats.totalProducts || 0, icon: Package, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { label: 'Total Users', value: data?.stats.totalUsers || 0, icon: Users, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { label: 'Pending Orders', value: data?.stats.pendingOrders || 0, icon: Clock, color: 'text-orange-400', bg: 'bg-orange-500/10' },
  ];

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-light text-white">Dashboard</h1>
        <p className="text-white/30 text-sm mt-1">Overview of your perfume store</p>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-28 bg-white/5 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white/5 rounded-2xl border border-white/5 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                  <stat.icon size={18} className={stat.color} />
                </div>
              </div>
              <p className="text-2xl font-light text-white">{stat.value}</p>
              <p className="text-xs text-white/30 mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white/5 rounded-2xl border border-white/5 p-6">
          <h3 className="text-white font-light mb-4">Recent Orders</h3>
          {data?.recentOrders?.length ? (
            <div className="space-y-3">
              {data.recentOrders.map((order: any) => (
                <div key={order.id} className="flex items-center justify-between text-sm">
                  <div>
                    <span className="text-white/80">{order.orderNumber}</span>
                    <span className="text-white/30 ml-2">by {order.user?.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-white/60">${parseFloat(order.total).toFixed(2)}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                      order.status === 'delivered' ? 'bg-green-500/10 text-green-400' :
                      order.status === 'shipped' ? 'bg-blue-500/10 text-blue-400' :
                      order.status === 'cancelled' ? 'bg-red-500/10 text-red-400' :
                      'bg-yellow-500/10 text-yellow-400'
                    }`}>{order.status}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : <p className="text-white/20 text-sm">No orders yet</p>}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white/5 rounded-2xl border border-white/5 p-6">
          <h3 className="text-white font-light mb-4">Order Status</h3>
          {data?.ordersByStatus?.length ? (
            <div className="space-y-3">
              {data.ordersByStatus.map((s: any) => (
                <div key={s.status} className="flex items-center justify-between text-sm">
                  <span className="text-white/60 capitalize">{s.status}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-[#d4af37] rounded-full" style={{ width: `${(s._count / data.stats.totalOrders) * 100}%` }} />
                    </div>
                    <span className="text-white/80 w-6 text-right">{s._count}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : <p className="text-white/20 text-sm">No data</p>}
        </motion.div>
      </div>
    </div>
  );
}
