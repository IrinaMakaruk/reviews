import type { Review } from "@shared/models";
import { loadReviews, saveReviews } from "../file-storage";

export async function saveNewReviews(incoming: Review[]): Promise<number> {
  const existing = await loadReviews();
  const existingIds = new Set(existing.map((r) => r.id));
  const deduped = incoming.filter((r) => !existingIds.has(r.id));
  const merged = [...deduped, ...existing];
  await saveReviews(merged);
  return deduped.length;
}

export async function getRecentReviews(hours: number = 48): Promise<Review[]> {
  const all = await loadReviews();
  const cutoff = Date.now() - hours * 3600 * 1000;
  return all.filter((r) => new Date(r.submittedAt).getTime() >= cutoff);
}
