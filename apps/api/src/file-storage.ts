import fs from "fs/promises";
import path from "path";
import type { Review } from "@shared/models";

const filePath = path.join(__dirname, "..", "..", "reviews.json");

export async function loadReviews(): Promise<Review[]> {
  try {
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export async function saveReviews(reviews: Review[]): Promise<void> {
  await fs.writeFile(filePath, JSON.stringify(reviews, null, 2), "utf-8");
}
