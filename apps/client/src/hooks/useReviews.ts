import { useEffect, useState } from 'react';
import { getRecentReviews } from '@/services/reviewService';
import type { Review } from '@shared/models';
import { isWithinLast48Hours } from '@/lib/date';

export function useReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getRecentReviews()
      .then((allReviews: Review[]) => {
        const filtered = allReviews.filter((review: Review) =>
          isWithinLast48Hours(review.submittedAt)
        );
        setReviews(filtered);
      })
      .catch(() => {
        setError('Failed to load reviews');
      })
      .finally(() => setLoading(false));
  }, []);

  return { reviews, loading, error };
}
