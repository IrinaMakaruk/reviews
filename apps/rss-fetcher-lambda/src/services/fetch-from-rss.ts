import { XMLParser } from "fast-xml-parser";
import type { Review } from "@shared/models";
import { stripHtml } from "utils/strip-html";

export async function fetchReviewsFromRSS(appId: string): Promise<Review[]> {
  const url = `https://itunes.apple.com/us/rss/customerreviews/id=${appId}/sortBy=mostRecent/xml`;
  const res = await fetch(url);
  const xml = await res.text();

  const parser = new XMLParser();
  const parsed = parser.parse(xml);

  const entries = parsed.feed.entry || [];
  const reviews: Review[] = [];
  const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000;

  if (Array.isArray(entries)) {
    for (const entry of entries) {
      const submittedAt = new Date(entry.updated).getTime();
      if (submittedAt < cutoff) break;

      reviews.push({
        id: entry.id,
        author: entry.author.name,
        title: entry.title,
        content: stripHtml(entry.content),
        score: parseInt(entry["im:rating"], 10),
        submittedAt: entry.updated,
      });
    }
  }

  return reviews;
}
