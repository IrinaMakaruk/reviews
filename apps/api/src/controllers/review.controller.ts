import type { Request, Response } from "express";
import { getRecentReviews, saveNewReviews } from "../services/review-service";

export async function handleGetReviews(req: Request, res: Response) {
  const result = await getRecentReviews();
  res.json(result);
}

export async function handleSaveReviews(req: Request, res: Response) {
  const apiKey = req.headers["x-api-key"];
  if (apiKey !== process.env.API_KEY) {
    return res.status(403).json({ error: "Unauthorized" });
  }

  const reviews = req.body.reviews;
  if (!Array.isArray(reviews)) {
    return res.status(400).json({ error: "Invalid review format" });
  }

  const added = await saveNewReviews(reviews);
  res.json({ added });
}
