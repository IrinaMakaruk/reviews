import { useEffect, useState } from 'react';
import { getRecentReviews } from '@/services/reviewService';
import type { Review } from '@shared/models';

export function useReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getRecentReviews()
      .then((allReviews) => {
        const cutoff = Date.now() - 48 * 60 * 60 * 1000;
        const filtered = allReviews.filter((r) => new Date(r.submittedAt).getTime() > cutoff);
        setReviews(filtered);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to load reviews');
      })
      .finally(() => setLoading(false));
  }, []);

  return { reviews, loading, error };
}
