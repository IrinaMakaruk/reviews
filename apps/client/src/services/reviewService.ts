import type { Review } from '@shared/models'

const API_URL = import.meta.env.VITE_API_URL

export const getRecentReviews = async (): Promise<Review[]> => {
  const res = await fetch(`${API_URL}/api/reviews/595068606`)
  if (!res.ok) throw new Error('Failed to load reviews')
  return res.json()
}
