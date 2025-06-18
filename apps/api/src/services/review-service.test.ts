import { describe, it, expect, vi, beforeEach } from 'vitest';

const mocks = vi.hoisted(() => ({
  mockLoadReviews: vi.fn(),
  mockSaveReviews: vi.fn(),
}));

vi.mock('@/repositories/review.repository', () => ({
  loadReviews: mocks.mockLoadReviews,
  saveReviews: mocks.mockSaveReviews,
}));

import { saveNewReviews } from './review-service';
import { Review } from '@shared/models';

describe('saveNewReviews', () => {
  let existingReviews: Review[];
  let newReviews: Review[];

  beforeEach(() => {
    vi.clearAllMocks();

    existingReviews = [
      {
        id: 'r1',
        title: 'Existing Review 1',
        author: 'Alice',
        content: 'Great product!',
        score: 5,
        submittedAt: '2025-06-01T10:00:00Z',
      },
      {
        id: 'r2',
        title: 'Existing Review 2',
        author: 'Bob',
        content: 'Good value',
        score: 4,
        submittedAt: '2025-06-02T11:00:00Z',
      },
    ];

    newReviews = [
      {
        id: 'r3',
        title: 'New Review 1',
        author: 'Charlie',
        content: 'Amazing!',
        score: 5,
        submittedAt: '2025-06-18T12:00:00Z',
      },
      {
        id: 'r4',
        title: 'New Review 2',
        author: 'Diana',
        content: 'Could be better',
        score: 3,
        submittedAt: '2025-06-18T13:00:00Z',
      },
    ];
  });

  describe('when no duplicates exist', () => {
    beforeEach(() => {
      mocks.mockLoadReviews.mockResolvedValue(existingReviews);
      mocks.mockSaveReviews.mockResolvedValue([]);
    });

    it('should return count of new reviews saved', async () => {
      const result = await saveNewReviews(newReviews);
      expect(result).toBe(2);
    });

    it('should call loadReviews once', async () => {
      await saveNewReviews(newReviews);
      expect(mocks.mockLoadReviews).toHaveBeenCalledOnce();
    });

    it('should call saveReviews once', async () => {
      await saveNewReviews(newReviews);
      expect(mocks.mockSaveReviews).toHaveBeenCalledOnce();
    });

    it('should merge existing and new reviews', async () => {
      await saveNewReviews(newReviews);
      expect(mocks.mockSaveReviews).toHaveBeenCalledWith([...existingReviews, ...newReviews]);
    });
  });

  describe('when duplicates exist', () => {
    let incomingWithDuplicates: Review[];

    beforeEach(() => {
      mocks.mockLoadReviews.mockResolvedValue(existingReviews);
      mocks.mockSaveReviews.mockResolvedValue([]);

      incomingWithDuplicates = [
        existingReviews[0],
        newReviews[0],
        existingReviews[1],
        newReviews[1],
      ];
    });

    it('should return count of new reviews only', async () => {
      const result = await saveNewReviews(incomingWithDuplicates);
      expect(result).toBe(2);
    });

    it('should save only new reviews with existing ones', async () => {
      await saveNewReviews(incomingWithDuplicates);
      expect(mocks.mockSaveReviews).toHaveBeenCalledWith([
        ...existingReviews,
        newReviews[0],
        newReviews[1],
      ]);
    });
  });

  describe('when all incoming reviews are duplicates', () => {
    beforeEach(() => {
      mocks.mockLoadReviews.mockResolvedValue(existingReviews);
    });

    it('should return 0', async () => {
      const result = await saveNewReviews(existingReviews);
      expect(result).toBe(0);
    });

    it('should call loadReviews once', async () => {
      await saveNewReviews(existingReviews);
      expect(mocks.mockLoadReviews).toHaveBeenCalledOnce();
    });

    it('should not call saveReviews', async () => {
      await saveNewReviews(existingReviews);
      expect(mocks.mockSaveReviews).not.toHaveBeenCalled();
    });
  });

  describe('when no existing reviews exist', () => {
    beforeEach(() => {
      mocks.mockLoadReviews.mockResolvedValue([]);
      mocks.mockSaveReviews.mockResolvedValue([]);
    });

    it('should return count of new reviews', async () => {
      const result = await saveNewReviews(newReviews);
      expect(result).toBe(2);
    });

    it('should call loadReviews once', async () => {
      await saveNewReviews(newReviews);
      expect(mocks.mockLoadReviews).toHaveBeenCalledOnce();
    });

    it('should save only new reviews', async () => {
      await saveNewReviews(newReviews);
      expect(mocks.mockSaveReviews).toHaveBeenCalledWith(newReviews);
    });
  });
});
