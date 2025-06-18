import { renderHook, waitFor } from '@testing-library/react';
import { useReviews } from '@/hooks/useReviews';
import * as reviewService from '@/services/reviewService';
import type { Review } from '@shared/models';

const mockReviews: Review[] = [
  {
    id: '1',
    author: 'Alice',
    title: '',
    content: 'Great app',
    score: 5,
    submittedAt: new Date().toISOString(),
  },
];

describe('#useReviews', () => {
  describe('when fetch is successful', () => {
    let result: {
      current: {
        reviews: Review[];
        loading: boolean;
        error: string | null;
      };
    };

    beforeEach(async () => {
      vi.spyOn(reviewService, 'getRecentReviews').mockResolvedValue(mockReviews);

      const { result: hookResult } = renderHook(() => useReviews());
      result = hookResult;

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });

    it('should set reviews', () => {
      expect(result.current.reviews).toEqual(mockReviews);
    });

    it('should not set error', () => {
      expect(result.current.error).toBeNull();
    });
  });

  describe('when fetch fails', () => {
    let result: {
      current: {
        reviews: Review[];
        loading: boolean;
        error: string | null;
      };
    };

    beforeEach(async () => {
      vi.spyOn(reviewService, 'getRecentReviews').mockRejectedValue(new Error('Fetch failed'));

      const { result: hookResult } = renderHook(() => useReviews());
      result = hookResult;

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });

    it('should set error', () => {
      expect(result.current.error).toBeTruthy();
    });

    it('should set reviews as empty array', () => {
      expect(result.current.reviews).toEqual([]);
    });
  });
});
