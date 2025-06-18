import { loadReviews, saveReviews } from '../repositories/review.repository';
import type { Review } from '@shared/models';

export async function saveNewReviews(incoming: Review[]): Promise<number> {
  const existing = await loadReviews();
  const existingIds = new Set(existing.map((r) => r.id));
  const deduped = incoming.filter((r) => !existingIds.has(r.id));
  if (deduped.length === 0) {
    return 0;
  }
  const merged = [...existing, ...deduped];
  await saveReviews(merged);
  return deduped.length;
}
