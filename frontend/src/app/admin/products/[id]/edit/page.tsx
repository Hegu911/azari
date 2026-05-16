'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import api from '@/lib/api';
import Button from '@/components/ui/Button';
import { Upload, X } from 'lucide-react';

export default function EditProduct() {
  const router = useRouter();
  const params = useParams();
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<any>(null);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const adminHeaders = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` } });

  useEffect(() => {
    const id = params.id;
    api.get('/admin/categories', adminHeaders()).then(({ data }) => setCategories(data));
    api.get('/admin/brands', adminHeaders()).then(({ data }) => setBrands(data));
    api.get(`/products/id/${id}`).then(({ data }) => {
      setForm({
        name: data.name, description: data.description || '', price: String(data.price),
        comparePrice: data.comparePrice ? String(data.comparePrice) : '', stock: String(data.stock),
        categoryId: String(data.categoryId), brandId: String(data.brandId),
        topNotes: data.topNotes || '', middleNotes: data.middleNotes || '', baseNotes: data.baseNotes || '',
        longevity: data.longevity || '', usageType: data.usageType || '', season: data.season || '',
        volume: data.volume || '', isFeatured: data.isFeatured, isBestSeller: data.isBestSeller,
        isTrending: data.isTrending, isActive: data.isActive,
      });
      if (data.image) setImagePreview(data.image);
    }).catch(() => router.push('/admin/products'));
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, String(v)));
      if (image) fd.append('image', image);
      await api.put(`/admin/products/${params.id}`, fd, { headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` } });
      router.push('/admin/products');
    } catch { alert('Error updating product'); } finally { setLoading(false); }
  };

  if (!form) return <div className="text-white/30 text-center py-12">Loading...</div>;

  const update = (key: string, value: any) => setForm((p: any) => ({ ...p, [key]: value }));

  return (
    <div className="max-w-4xl space-y-6">
      <h1 className="text-2xl font-light text-white">Edit Product</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white/5 rounded-2xl border border-white/5 p-6 space-y-4">
          <h3 className="text-white font-light">Basic Info</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input placeholder="Product Name" value={form.name} onChange={(e) => update('name', e.target.value)} required className="col-span-2 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#d4af37]" />
            <select value={form.categoryId} onChange={(e) => update('categoryId', e.target.value)} required className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#d4af37]">
              {categories.map((c: any) => <option key={c.id} value={c.id} className="bg-black">{c.name}</option>)}
            </select>
            <select value={form.brandId} onChange={(e) => update('brandId', e.target.value)} required className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#d4af37]">
              {brands.map((b: any) => <option key={b.id} value={b.id} className="bg-black">{b.name}</option>)}
            </select>
          </div>
        </div>

        <div className="bg-white/5 rounded-2xl border border-white/5 p-6 space-y-4">
          <h3 className="text-white font-light">Image</h3>
          <div className="flex items-start gap-4">
            <div
              onClick={() => fileRef.current?.click()}
              className="w-32 h-32 rounded-xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#d4af37] transition-colors bg-white/5 overflow-hidden"
            >
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-xl" />
              ) : (
                <>
                  <Upload size={20} className="text-white/30" />
                  <span className="text-[10px] text-white/30 text-center px-2">Click to upload</span>
                </>
              )}
            </div>
            {imagePreview && (
              <button type="button" onClick={() => { setImage(null); setImagePreview(null); }} className="p-1 text-white/30 hover:text-red-400 transition-colors cursor-pointer">
                <X size={16} />
              </button>
            )}
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) { setImage(file); setImagePreview(URL.createObjectURL(file)); }
            }} />
          </div>
        </div>

        <div className="bg-white/5 rounded-2xl border border-white/5 p-6 space-y-4">
          <h3 className="text-white font-light">Pricing & Inventory</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input type="number" step="0.01" placeholder="Price" value={form.price} onChange={(e) => update('price', e.target.value)} required className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#d4af37]" />
            <input type="number" step="0.01" placeholder="Compare Price" value={form.comparePrice} onChange={(e) => update('comparePrice', e.target.value)} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#d4af37]" />
            <input type="number" placeholder="Stock" value={form.stock} onChange={(e) => update('stock', e.target.value)} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#d4af37]" />
          </div>
        </div>

        <div className="bg-white/5 rounded-2xl border border-white/5 p-6 space-y-4">
          <h3 className="text-white font-light">Fragrance Notes</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input placeholder="Top Notes" value={form.topNotes} onChange={(e) => update('topNotes', e.target.value)} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#d4af37]" />
            <input placeholder="Middle Notes" value={form.middleNotes} onChange={(e) => update('middleNotes', e.target.value)} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#d4af37]" />
            <input placeholder="Base Notes" value={form.baseNotes} onChange={(e) => update('baseNotes', e.target.value)} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#d4af37]" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input placeholder="Longevity" value={form.longevity} onChange={(e) => update('longevity', e.target.value)} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm" />
            <select value={form.usageType} onChange={(e) => update('usageType', e.target.value)} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm">
              <option value="" className="bg-black">Usage Type</option>
              <option value="Day" className="bg-black">Day</option>
              <option value="Night" className="bg-black">Night</option>
              <option value="Day & Night" className="bg-black">Day & Night</option>
            </select>
            <input placeholder="Season" value={form.season} onChange={(e) => update('season', e.target.value)} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm" />
          </div>
        </div>

        <div className="bg-white/5 rounded-2xl border border-white/5 p-6 space-y-4">
          <h3 className="text-white font-light">Flags</h3>
          <div className="flex flex-wrap gap-6">
            {[{ key: 'isFeatured', label: 'Featured' }, { key: 'isBestSeller', label: 'Best Seller' }, { key: 'isTrending', label: 'Trending' }, { key: 'isActive', label: 'Active' }].map(({ key, label }) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={(form as any)[key]} onChange={(e) => update(key, e.target.checked)} className="w-4 h-4 rounded border-white/20 bg-white/5 text-[#d4af37] focus:ring-[#d4af37]" />
                <span className="text-sm text-white/60">{label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <Button type="submit" variant="gold" loading={loading}>Save Changes</Button>
          <button type="button" onClick={() => router.back()} className="px-6 py-3 text-sm text-white/40 hover:text-white transition-colors cursor-pointer">Cancel</button>
        </div>
      </form>
    </div>
  );
}
