import { fetchReviewsFromRSS } from "./services/fetch-from-rss";
import { pushReviewsToApi } from "./services/push-to-api";

export const fetchReviews = async () => {
  const appId = process.env.APP_ID!;
  const reviews = await fetchReviewsFromRSS(appId);

  console.log(`[Lambda] Fetched ${reviews.length} recent reviews`);

  const response = await pushReviewsToApi(reviews);
  console.log("[Lambda] API response:", response?.status, response?.data);

  return {
    statusCode: 200,
    body: JSON.stringify({ pushed: reviews.length }),
  };
};
