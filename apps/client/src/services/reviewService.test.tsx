import { getRecentReviews } from '@/services/reviewService';
import { fetcher } from '@/lib/fetcher';
import type { Review } from '@shared/models';
import { vi, type MockedFunction } from 'vitest';

vi.mock('@/lib/fetcher', () => ({
  fetcher: vi.fn(),
}));

const mockReviews: Review[] = [
  {
    id: 'r1',
    author: 'Alice',
    title: 'Great!',
    content: 'Love it.',
    score: 5,
    submittedAt: new Date().toISOString(),
  },
];

describe('#getRecentReviews', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return reviews from fetcher', async () => {
    (fetcher as MockedFunction<typeof fetcher>).mockResolvedValueOnce(mockReviews);

    const result = await getRecentReviews();

    expect(fetcher).toHaveBeenCalledWith(
      `${import.meta.env.VITE_API_URL}/api/reviews/${import.meta.env.VITE_APP_ID}`
    );
    expect(result).toEqual(mockReviews);
  });

  it('should throw if fetcher fails', async () => {
    (fetcher as MockedFunction<typeof fetcher>).mockRejectedValueOnce(new Error('Network error'));

    await expect(getRecentReviews()).rejects.toThrow('Network error');
  });
});
