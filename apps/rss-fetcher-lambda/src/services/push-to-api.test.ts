import { pushReviewsToApi } from "./push-to-api";
import type { Review } from "@shared/models";
import { vi } from "vitest";

const mockReviews: Review[] = [
  {
    id: "1",
    author: "Test User",
    title: "Nice App",
    content: "Works great!",
    score: 4,
    submittedAt: new Date().toISOString(),
  },
];

describe("#pushReviewsToApi", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetAllMocks();
    process.env = {
      ...originalEnv,
      API_URL: "http://fake-api.com",
      API_KEY: "test-key",
    };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe("when the request is successful", () => {
    beforeEach(() => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      }) as any;
    });

    it("should POST reviews to the API and return response", async () => {
      const response = await pushReviewsToApi(mockReviews);
      expect(global.fetch).toHaveBeenCalledWith(
        "http://fake-api.com/api/reviews/save",
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            "Content-Type": "application/json",
            "x-api-key": "test-key",
          }),
          body: JSON.stringify({ reviews: mockReviews }),
        })
      );
      expect(response).toEqual({ success: true });
    });
  });

  describe("when the request fails", () => {
    beforeEach(() => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        statusText: "Internal Server Error",
      }) as any;
    });

    it("should throw an error", async () => {
      await expect(pushReviewsToApi(mockReviews)).rejects.toThrow(
        "Failed to push reviews: Internal Server Error"
      );
    });
  });
});
