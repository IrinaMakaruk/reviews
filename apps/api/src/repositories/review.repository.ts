import fs from "fs/promises";
import path from "path";
import type { Review } from "@shared/models";

const FILE_PATH = path.resolve("reviews.json");

export async function loadReviews(): Promise<Review[]> {
  try {
    const data = await fs.readFile(FILE_PATH, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export async function saveReviews(reviews: Review[]): Promise<void> {
  await fs.writeFile(FILE_PATH, JSON.stringify(reviews, null, 2), "utf-8");
}
