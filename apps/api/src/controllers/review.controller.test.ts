import { describe, beforeEach, it, expect, vi, type MockedFunction, MockInstance } from 'vitest';
import type { Request, Response } from 'express';
import type { Review } from '@shared/models';
import { handleSaveReviews } from '../controllers/review.controller';
import * as reviewService from '../services/review-service';

interface MockResponse {
  status: MockedFunction<(code: number) => MockResponse>;
  json: MockedFunction<(body: any) => MockResponse>;
}

interface MockRequest {
  headers: Record<string, string>;
  body: {
    reviews?: Review[] | any;
  };
}

function createMockRes(): MockResponse {
  const res = {} as MockResponse;
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
}

describe('#handleSaveReviews', () => {
  const validApiKey: string = 'test-api-key';
  let res: MockResponse;

  beforeEach(() => {
    process.env.API_KEY = validApiKey;
    res = createMockRes();
    vi.clearAllMocks();
  });

  describe('when API key is invalid', () => {
    let req: MockRequest;

    beforeEach(() => {
      req = {
        headers: { 'x-api-key': 'invalid-key' },
        body: {},
      };
    });

    it('should respond with 403 status', async () => {
      await handleSaveReviews(req as unknown as Request, res as unknown as Response);
      expect(res.status).toHaveBeenCalledWith(403);
    });

    it('should respond with Unauthorized error', async () => {
      await handleSaveReviews(req as unknown as Request, res as unknown as Response);
      expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized' });
    });
  });

  describe('when review format is invalid', () => {
    let req: MockRequest;

    beforeEach(() => {
      req = {
        headers: { 'x-api-key': validApiKey },
        body: { reviews: {} },
      };
    });

    it('should respond with 400 status', async () => {
      await handleSaveReviews(req as unknown as Request, res as unknown as Response);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should respond with Invalid review format error', async () => {
      await handleSaveReviews(req as unknown as Request, res as unknown as Response);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid review format' });
    });
  });

  describe('when request is valid', () => {
    let req: MockRequest;
    let mockReviews: Review[];
    let saveNewReviewsSpy: MockInstance<(incoming: Review[]) => Promise<number>>;

    beforeEach(() => {
      mockReviews = [
        {
          id: 'r1',
          title: 'Great Product',
          author: 'John',
          content: 'Nice',
          score: 5,
          submittedAt: '2025-06-18T10:00:00Z',
        },
      ];

      req = {
        headers: { 'x-api-key': validApiKey },
        body: { reviews: mockReviews },
      };

      saveNewReviewsSpy = vi.spyOn(reviewService, 'saveNewReviews').mockResolvedValue(1);
    });

    it('should call saveNewReviews with correct reviews', async () => {
      await handleSaveReviews(req as unknown as Request, res as unknown as Response);
      expect(saveNewReviewsSpy).toHaveBeenCalledWith(mockReviews);
    });

    it('should respond with added count', async () => {
      await handleSaveReviews(req as unknown as Request, res as unknown as Response);
      expect(res.json).toHaveBeenCalledWith({ added: 1 });
    });
  });
});
