import { XMLParser } from "fast-xml-parser";
import type { Review } from "@shared/models";

export async function fetchReviewsFromRSS(appId: string): Promise<Review[]> {
  const url = `https://itunes.apple.com/us/rss/customerreviews/id=${appId}/sortBy=mostRecent/xml`;
  const res = await fetch(url);
  const xml = await res.text();

  const parser = new XMLParser();
  const parsed = parser.parse(xml);

  const entries = parsed.feed.entry || [];

  return Array.isArray(entries)
    ? entries.map((entry: any) => ({
        id: entry.id,
        author: entry.author.name,
        content: entry.content,
        score: parseInt(entry["im:rating"], 10),
        submittedAt: entry.updated,
      }))
    : [];
}
