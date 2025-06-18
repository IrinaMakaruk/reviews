import { fetcher } from '@/lib/fetcher';
import type { Review } from '@shared/models';

const API_URL = import.meta.env.VITE_API_URL;
const appId = import.meta.env.VITE_APP_ID;

export const getRecentReviews = async (): Promise<Review[]> => {
  return fetcher<Review[]>(`${API_URL}/api/reviews/${appId}`);
};
