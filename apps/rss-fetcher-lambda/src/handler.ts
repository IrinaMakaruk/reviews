import { fetchReviewsFromRSS } from "./services/fetch-from-rss";
import { pushReviewsToApi } from "./services/push-to-api";

export const fetchReviews = async () => {
  const appId = process.env.APP_ID!;
  const reviews = await fetchReviewsFromRSS(appId);
  await pushReviewsToApi(reviews);

  return {
    statusCode: 200,
    body: JSON.stringify({ pushed: reviews.length }),
  };
};
