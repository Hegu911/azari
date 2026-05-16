'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import api from '@/lib/api';

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const adminHeaders = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` } });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/products', { params: { page, search }, ...adminHeaders() });
      setProducts(data.products);
      setTotal(data.total);
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => { fetchProducts(); }, [page]);

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this product?')) return;
    try {
      await api.delete(`/admin/products/${id}`, adminHeaders());
      fetchProducts();
    } catch {}
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-light text-white">Products</h1>
          <p className="text-white/30 text-sm">{total} products</p>
        </div>
        <Link href="/admin/products/new" className="flex items-center gap-2 px-4 py-2 bg-[#d4af37] text-black rounded-xl text-sm font-medium hover:bg-[#c9a96e] transition-colors">
          <Plus size={16} /> New Product
        </Link>
      </div>

      <div className="relative max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
        <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search products..." className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#d4af37]" />
      </div>

      <div className="bg-white/5 rounded-2xl border border-white/5 overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-12 bg-white/5 rounded-xl animate-pulse" />)}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 text-white/30 text-sm">No products found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 text-white/40 text-xs uppercase tracking-wider">
                  <th className="text-left p-4 font-normal">Product</th>
                  <th className="text-left p-4 font-normal">Category</th>
                  <th className="text-left p-4 font-normal">Brand</th>
                  <th className="text-left p-4 font-normal">Price</th>
                  <th className="text-left p-4 font-normal">Stock</th>
                  <th className="text-left p-4 font-normal">Status</th>
                  <th className="text-right p-4 font-normal">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#111] bg-cover bg-center shrink-0" style={{ backgroundImage: `url(${product.image || '/images/placeholder.svg'})` }} />
                        <span className="text-white/80 truncate max-w-[200px]">{product.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-white/40">{product.category?.name}</td>
                    <td className="p-4 text-white/40">{product.brand?.name}</td>
                    <td className="p-4 text-white/80">${parseFloat(product.price).toFixed(2)}</td>
                    <td className="p-4">
                      <span className={product.stock > 0 ? 'text-green-400' : 'text-red-400'}>{product.stock}</span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] ${product.isActive ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                        {product.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/products/${product.id}/edit`} className="p-2 text-white/30 hover:text-white transition-colors">
                          <Edit size={14} />
                        </Link>
                        <button onClick={() => handleDelete(product.id)} className="p-2 text-white/30 hover:text-red-400 transition-colors cursor-pointer">
                          <Trash2 size={14} />
                        </button>
                      </div>
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
    </div>
  );
}
