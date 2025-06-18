import { vi } from "vitest";

import { fetchReviewsFromRSS } from "./fetch-from-rss";

vi.stubGlobal("fetch", vi.fn());

const mockXml = `
  <feed>
    <entry>
      <id>1</id>
      <author><name>Alice</name></author>
      <title>Great app</title>
      <content>This is awesome!</content>
      <im:rating>5</im:rating>
      <updated>${new Date().toISOString()}</updated>
    </entry>
    <entry>
      <id>2</id>
      <author><name>Bob</name></author>
      <title>Old review</title>
      <content>Old review content</content>
      <im:rating>2</im:rating>
      <updated>${new Date(
        Date.now() - 40 * 24 * 60 * 60 * 1000
      ).toISOString()}</updated>
    </entry>
  </feed>
`;

describe("fetchReviewsFromRSS", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn().mockResolvedValue({
      text: () => Promise.resolve(mockXml),
    });
  });

  it("should return recent reviews only and parse content", async () => {
    const result = await fetchReviewsFromRSS("123456");

    expect(result).toEqual([
      {
        id: 1,
        author: "Alice",
        title: "Great app",
        content: "This is awesome!",
        score: 5,
        submittedAt: expect.any(String),
      },
    ]);
  });
});
