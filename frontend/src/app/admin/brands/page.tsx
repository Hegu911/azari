'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import api from '@/lib/api';

export default function AdminBrands() {
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const adminHeaders = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` } });

  const fetchBrands = async () => {
    try {
      const { data } = await api.get('/admin/brands', adminHeaders());
      setBrands(data);
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => { fetchBrands(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editId) {
        await api.put(`/admin/brands/${editId}`, { name, description }, adminHeaders());
      } else {
        await api.post('/admin/brands', { name, description }, adminHeaders());
      }
      setName(''); setDescription(''); setEditId(null);
      fetchBrands();
    } catch { alert('Error saving brand'); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this brand?')) return;
    try { await api.delete(`/admin/brands/${id}`, adminHeaders()); fetchBrands(); } catch {}
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-light text-white">Brands</h1>

      <form onSubmit={handleSubmit} className="bg-white/5 rounded-2xl border border-white/5 p-6 flex gap-4 items-end">
        <div className="flex-1">
          <input placeholder="Brand name" value={name} onChange={(e) => setName(e.target.value)} required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#d4af37]" />
        </div>
        <div className="flex-1">
          <input placeholder="Description (optional)" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm" />
        </div>
        <Button type="submit" variant="gold" size="sm">{editId ? 'Update' : 'Add'}</Button>
        {editId && <button type="button" onClick={() => { setEditId(null); setName(''); setDescription(''); }} className="text-xs text-white/40 hover:text-white cursor-pointer">Cancel</button>}
      </form>

      <div className="bg-white/5 rounded-2xl border border-white/5 overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-4">
            {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-12 bg-white/5 rounded-xl animate-pulse" />)}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 text-white/40 text-xs uppercase">
                  <th className="text-left p-4 font-normal">Name</th>
                  <th className="text-left p-4 font-normal">Slug</th>
                  <th className="text-left p-4 font-normal">Products</th>
                  <th className="text-right p-4 font-normal">Actions</th>
                </tr>
              </thead>
              <tbody>
                {brands.map((brand) => (
                  <tr key={brand.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-4 text-white/80">{brand.name}</td>
                    <td className="p-4 text-white/40 text-xs">{brand.slug}</td>
                    <td className="p-4 text-white/60">{brand._count?.products || 0}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => { setEditId(brand.id); setName(brand.name); setDescription(brand.description || ''); }} className="p-2 text-white/30 hover:text-white cursor-pointer"><Edit size={14} /></button>
                        <button onClick={() => handleDelete(brand.id)} className="p-2 text-white/30 hover:text-red-400 cursor-pointer"><Trash2 size={14} /></button>
                      </div>
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
