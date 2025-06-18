import type { Review } from "@shared/models";
import { loadReviews, saveReviews } from "../s3-storage";

export async function saveNewReviews(incoming: Review[]): Promise<number> {
  const existing = await loadReviews();
  const existingIds = new Set(existing.map((r) => r.id));
  const deduped = incoming.filter((r) => !existingIds.has(r.id));
  const merged = [...deduped, ...existing];
  await saveReviews(merged);
  return deduped.length;
}
