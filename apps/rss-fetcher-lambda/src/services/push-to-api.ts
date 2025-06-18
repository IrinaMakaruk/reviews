import type { Review } from "@shared/models";

export async function pushReviewsToApi(reviews: Review[]): Promise<any> {
  const url = process.env.API_URL! ?? "http://localhost:3001";
  const apiKey = process.env.API_KEY!;

  const res = await fetch(`${url}/api/reviews/save`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
    },
    body: JSON.stringify({ reviews }),
  });

  if (!res.ok) {
    throw new Error(`Failed to push reviews: ${res.statusText}`);
  }

  return res.json();
}
