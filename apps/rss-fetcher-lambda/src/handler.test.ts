import { fetchReviews } from "./handler";
import * as api from "./services/push-to-api";
import * as rss from "./services/fetch-from-rss";

describe("fetchReviews", () => {
  describe("when successful", () => {
    beforeEach(() => {
      vi.spyOn(rss, "fetchReviewsFromRSS").mockResolvedValue([
        {
          id: "1",
          author: "Test",
          title: "",
          content: "Nice",
          score: 5,
          submittedAt: new Date().toISOString(),
        },
      ]);
      vi.spyOn(api, "pushReviewsToApi").mockResolvedValue(undefined);
    });

    it("should call getAppStoreReviews and complete without throwing", async () => {
      await expect(fetchReviews()).resolves.not.toThrow();
    });
  });
});
