'use client';

import { useState, useEffect } from 'react';
import { Trash2, Star } from 'lucide-react';
import api from '@/lib/api';

export default function AdminReviews() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const adminHeaders = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` } });

  const fetchReviews = async () => {
    try {
      const { data } = await api.get('/admin/reviews', adminHeaders());
      setReviews(data);
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => { fetchReviews(); }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this review?')) return;
    try { await api.delete(`/admin/reviews/${id}`, adminHeaders()); fetchReviews(); } catch {}
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-light text-white">Reviews</h1>
        <p className="text-white/30 text-sm">{reviews.length} reviews</p>
      </div>

      <div className="bg-white/5 rounded-2xl border border-white/5 overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-4">
            {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-12 bg-white/5 rounded-xl animate-pulse" />)}
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-12 text-white/30 text-sm">No reviews yet</div>
        ) : (
          <div className="space-y-2 p-4">
            {reviews.map((review) => (
              <div key={review.id} className="flex items-start justify-between p-4 rounded-xl hover:bg-white/5 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white/80 text-sm font-medium">{review.user?.name}</span>
                    <span className="text-white/20 text-xs">on</span>
                    <span className="text-[#d4af37] text-xs">{review.product?.name}</span>
                  </div>
                  <div className="flex items-center gap-1 mb-2">
                    {Array.from({ length: 5 }).map((_, s) => (
                      <Star key={s} size={12} className={s < review.rating ? 'text-[#d4af37] fill-[#d4af37]' : 'text-white/10'} />
                    ))}
                  </div>
                  {review.comment && <p className="text-white/50 text-xs">{review.comment}</p>}
                  <p className="text-white/20 text-[10px] mt-1">{new Date(review.createdAt).toLocaleDateString()}</p>
                </div>
                <button onClick={() => handleDelete(review.id)} className="p-2 text-white/30 hover:text-red-400 transition-colors cursor-pointer">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
