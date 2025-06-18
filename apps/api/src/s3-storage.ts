import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { Readable } from "stream";
import { Review } from "@shared/models";

const region = process.env.AWS_REGION;
const s3 = new S3Client({ region });
const BUCKET = process.env.REVIEWS_BUCKET!;
const KEY = "reviews.json";

async function streamToString(stream: Readable): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
    stream.on("error", reject);
  });
}

export async function loadReviews(): Promise<Review[]> {
  try {
    const res = await s3.send(
      new GetObjectCommand({ Bucket: BUCKET, Key: KEY })
    );
    const body = await streamToString(res.Body as Readable);
    return JSON.parse(body);
  } catch (err) {
    return [];
  }
}

export async function saveReviews(reviews: Review[]): Promise<void> {
  const body = JSON.stringify(reviews, null, 2);
  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: KEY,
      Body: body,
      ContentType: "application/json",
    })
  );
}
