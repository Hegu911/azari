'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, User } from 'lucide-react';
import { Review } from '@/types';
import Button from '@/components/ui/Button';
import { useAuth } from '@/store/authContext';
import { reviewsAPI } from '@/lib/api';
import { useToast } from '@/components/ui/Toast';

interface ReviewsProps {
  reviews: Review[];
  productId: number;
  onReviewAdded: () => void;
}

export default function Reviews({ reviews, productId, onReviewAdded }: ReviewsProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const { user } = useAuth();
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) return;
    setSubmitting(true);
    try {
      await reviewsAPI.create({ productId, rating, comment });
      showToast('success', 'Rəy göndərildi');
      setRating(0);
      setComment('');
      setShowForm(false);
      onReviewAdded();
    } catch {
      showToast('error', 'Rəy göndərilmədi');
    } finally {
      setSubmitting(false);
    }
  };

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex items-center justify-between"
      >
        <div>
          <h3 className="text-lg font-light text-charcoal tracking-wide">Müştəri Rəyləri</h3>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, s) => (
                <Star key={s} size={14} className={s < Math.round(Number(avgRating)) ? 'text-gold fill-gold' : 'text-charcoal/10'} />
              ))}
            </div>
            <span className="text-charcoal/50 text-sm">{avgRating} ({reviews.length} rəy)</span>
          </div>
        </div>
        {user && (
          <Button variant="outline" size="sm" onClick={() => setShowForm(!showForm)}>
            Rəy Yaz
          </Button>
        )}
      </motion.div>

      {showForm && (
        <motion.form
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          onSubmit={handleSubmit}
          className="bg-cream-dark rounded-2xl p-6 border border-warm-gray space-y-4"
        >
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((r) => (
              <button key={r} type="button" onClick={() => setRating(r)} className="cursor-pointer">
                <Star size={20} className={r <= rating ? 'text-gold fill-gold' : 'text-charcoal/20'} />
              </button>
            ))}
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Təcrübənizi paylaşın..."
            rows={3}
            className="w-full bg-cream-dark border border-warm-gray rounded-xl px-4 py-3 text-charcoal text-sm placeholder:text-charcoal/20 focus:outline-none focus:border-gold resize-none"
          />
          <div className="flex gap-3">
            <Button type="submit" variant="gold" size="sm" loading={submitting}>Göndər</Button>
            <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}>Ləğv Et</Button>
          </div>
        </motion.form>
      )}

      <div className="space-y-4">
        {reviews.map((review) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-cream-dark rounded-2xl p-6 border border-warm-gray"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-warm-gray-light flex items-center justify-center">
                  <User size={16} className="text-charcoal/40" />
                </div>
                <div>
                  <p className="text-charcoal text-sm font-light">{review.user.name}</p>
                  <p className="text-charcoal/30 text-xs">{new Date(review.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star key={s} size={12} className={s < review.rating ? 'text-gold fill-gold' : 'text-charcoal/10'} />
                ))}
              </div>
            </div>
            {review.comment && <p className="text-charcoal/50 text-sm leading-relaxed">{review.comment}</p>}
          </motion.div>
        ))}
        {reviews.length === 0 && (
          <p className="text-charcoal/30 text-sm text-center py-8">Hələ rəy yoxdur. İlk rəy yazan siz olun!</p>
        )}
      </div>
    </div>
  );
}
