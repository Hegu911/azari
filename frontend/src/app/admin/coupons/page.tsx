'use client';

import { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import api from '@/lib/api';

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ code: '', description: '', discountType: 'percentage', discountValue: '', minOrderAmount: '', maxUses: '' });

  const adminHeaders = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` } });

  const fetchCoupons = async () => {
    try {
      const { data } = await api.get('/admin/coupons', adminHeaders());
      setCoupons(data);
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => { fetchCoupons(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/admin/coupons', form, adminHeaders());
      setForm({ code: '', description: '', discountType: 'percentage', discountValue: '', minOrderAmount: '', maxUses: '' });
      fetchCoupons();
    } catch { alert('Error creating coupon'); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this coupon?')) return;
    try { await api.delete(`/admin/coupons/${id}`, adminHeaders()); fetchCoupons(); } catch {}
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-light text-white">Coupons</h1>

      <form onSubmit={handleSubmit} className="bg-white/5 rounded-2xl border border-white/5 p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <input placeholder="Code (e.g. SAVE20)" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} required className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#d4af37]" />
        <select value={form.discountType} onChange={(e) => setForm({ ...form, discountType: e.target.value })} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#d4af37]">
          <option value="percentage" className="bg-black">Percentage</option>
          <option value="fixed" className="bg-black">Fixed Amount</option>
        </select>
        <input type="number" placeholder="Value" value={form.discountValue} onChange={(e) => setForm({ ...form, discountValue: e.target.value })} required className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#d4af37]" />
        <input type="number" placeholder="Min Order (optional)" value={form.minOrderAmount} onChange={(e) => setForm({ ...form, minOrderAmount: e.target.value })} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20" />
        <input type="number" placeholder="Max Uses (optional)" value={form.maxUses} onChange={(e) => setForm({ ...form, maxUses: e.target.value })} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20" />
        <div className="flex items-end">
          <Button type="submit" variant="gold">Add Coupon</Button>
        </div>
      </form>

      <div className="bg-white/5 rounded-2xl border border-white/5 overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-4">
            {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-12 bg-white/5 rounded-xl animate-pulse" />)}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 text-white/40 text-xs uppercase">
                  <th className="text-left p-4 font-normal">Code</th>
                  <th className="text-left p-4 font-normal">Type</th>
                  <th className="text-left p-4 font-normal">Value</th>
                  <th className="text-left p-4 font-normal">Min Order</th>
                  <th className="text-left p-4 font-normal">Uses</th>
                  <th className="text-left p-4 font-normal">Active</th>
                  <th className="text-right p-4 font-normal">Actions</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((c) => (
                  <tr key={c.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="p-4 text-white/80 font-mono text-xs">{c.code}</td>
                    <td className="p-4 text-white/40 capitalize text-xs">{c.discountType}</td>
                    <td className="p-4 text-white/80">{c.discountType === 'percentage' ? `${c.discountValue}%` : `$${c.discountValue}`}</td>
                    <td className="p-4 text-white/40 text-xs">{c.minOrderAmount ? `$${c.minOrderAmount}` : '—'}</td>
                    <td className="p-4 text-white/60 text-xs">{c.usedCount}/{c.maxUses || '∞'}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] ${c.isActive ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>{c.isActive ? 'Yes' : 'No'}</span>
                    </td>
                    <td className="p-4 text-right">
                      <button onClick={() => handleDelete(c.id)} className="p-2 text-white/30 hover:text-red-400 cursor-pointer"><Trash2 size={14} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
