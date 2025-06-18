import { describe, it, expect, vi, beforeEach, type MockedFunction } from 'vitest';
import { Readable } from 'stream';
import type { Review } from '@shared/models';

interface MockS3Functions {
  mockS3Send: MockedFunction<any>;
  mockGetObjectCommand: MockedFunction<any>;
  mockPutObjectCommand: MockedFunction<any>;
}

const mocks: MockS3Functions = vi.hoisted(() => ({
  mockS3Send: vi.fn(),
  mockGetObjectCommand: vi.fn(),
  mockPutObjectCommand: vi.fn(),
}));

vi.mock('@aws-sdk/client-s3', () => ({
  S3Client: vi.fn().mockImplementation(() => ({
    send: mocks.mockS3Send,
  })),
  GetObjectCommand: mocks.mockGetObjectCommand,
  PutObjectCommand: mocks.mockPutObjectCommand,
}));

import { loadReviews, saveReviews } from '../repositories/review.repository';

describe('Reviews Service', () => {
  let mockReviews: Review[];

  beforeEach(() => {
    vi.clearAllMocks();
    mocks.mockGetObjectCommand.mockImplementation((input: any) => ({ input }));
    mocks.mockPutObjectCommand.mockImplementation((input: any) => ({ input }));

    mockReviews = [
      {
        id: 'r1',
        title: 'Wow',
        author: 'Alice',
        content: 'Great!',
        score: 5,
        submittedAt: '2025-06-18T20:42:08.308Z',
      },
    ];
  });

  describe('when loading reviews from S3 successfully', () => {
    let mockStream: Readable;

    beforeEach(() => {
      mockStream = new Readable({
        read() {
          this.push(JSON.stringify(mockReviews));
          this.push(null);
        },
      });
      mocks.mockS3Send.mockResolvedValue({
        Body: mockStream,
      });
    });

    it('should return reviews array', async () => {
      const result: Review[] = await loadReviews();
      expect(result).toEqual(mockReviews);
    });

    it('should call S3 send with correct parameters', async () => {
      await loadReviews();
      expect(mocks.mockS3Send).toHaveBeenCalledWith(
        expect.objectContaining({
          input: {
            Bucket: process.env.REVIEWS_BUCKET,
            Key: 'reviews.json',
          },
        })
      );
    });

    it('should call GetObjectCommand with correct parameters', async () => {
      await loadReviews();
      expect(mocks.mockGetObjectCommand).toHaveBeenCalledWith({
        Bucket: process.env.REVIEWS_BUCKET,
        Key: 'reviews.json',
      });
    });
  });

  describe('when S3 object does not exist', () => {
    beforeEach(() => {
      mocks.mockS3Send.mockRejectedValue(new Error('NoSuchKey'));
    });

    it('should return empty array', async () => {
      const result: Review[] = await loadReviews();
      expect(result).toEqual([]);
    });

    it('should call S3 send', async () => {
      await loadReviews();
      expect(mocks.mockS3Send).toHaveBeenCalled();
    });
  });

  describe('when S3 throws any error', () => {
    beforeEach(() => {
      mocks.mockS3Send.mockRejectedValue(new Error('Access denied'));
    });

    it('should return empty array', async () => {
      const result: Review[] = await loadReviews();
      expect(result).toEqual([]);
    });

    it('should call S3 send', async () => {
      await loadReviews();
      expect(mocks.mockS3Send).toHaveBeenCalled();
    });
  });

  describe('when JSON is malformed', () => {
    let mockStream: Readable;

    beforeEach(() => {
      mockStream = new Readable({
        read() {
          this.push('invalid json');
          this.push(null);
        },
      });
      mocks.mockS3Send.mockResolvedValue({
        Body: mockStream,
      });
    });

    it('should return empty array', async () => {
      const result: Review[] = await loadReviews();
      expect(result).toEqual([]);
    });

    it('should call S3 send', async () => {
      await loadReviews();
      expect(mocks.mockS3Send).toHaveBeenCalled();
    });
  });

  describe('when stream errors occur', () => {
    let mockStream: Readable;

    beforeEach(() => {
      mockStream = new Readable({
        read() {
          this.emit('error', new Error('Stream error'));
        },
      });
      mocks.mockS3Send.mockResolvedValue({
        Body: mockStream,
      });
    });

    it('should return empty array', async () => {
      const result: Review[] = await loadReviews();
      expect(result).toEqual([]);
    });

    it('should call S3 send', async () => {
      await loadReviews();
      expect(mocks.mockS3Send).toHaveBeenCalled();
    });
  });

  describe('when saving reviews to S3 successfully', () => {
    beforeEach(() => {
      mocks.mockS3Send.mockResolvedValue({});
    });

    it('should call S3 send with correct parameters', async () => {
      await saveReviews(mockReviews);
      expect(mocks.mockS3Send).toHaveBeenCalledWith(
        expect.objectContaining({
          input: {
            Bucket: process.env.REVIEWS_BUCKET,
            Key: 'reviews.json',
            Body: JSON.stringify(mockReviews, null, 2),
            ContentType: 'application/json',
          },
        })
      );
    });

    it('should call PutObjectCommand with correct parameters', async () => {
      await saveReviews(mockReviews);
      expect(mocks.mockPutObjectCommand).toHaveBeenCalledWith({
        Bucket: process.env.REVIEWS_BUCKET,
        Key: 'reviews.json',
        Body: JSON.stringify(mockReviews, null, 2),
        ContentType: 'application/json',
      });
    });
  });

  describe('when saving empty reviews array', () => {
    let emptyArray: Review[];

    beforeEach(() => {
      mocks.mockS3Send.mockResolvedValue({});
      emptyArray = [];
    });

    it('should call S3 send with empty array', async () => {
      await saveReviews(emptyArray);
      expect(mocks.mockS3Send).toHaveBeenCalledWith(
        expect.objectContaining({
          input: {
            Bucket: process.env.REVIEWS_BUCKET,
            Key: 'reviews.json',
            Body: JSON.stringify(emptyArray, null, 2),
            ContentType: 'application/json',
          },
        })
      );
    });

    it('should call PutObjectCommand with empty array', async () => {
      await saveReviews(emptyArray);
      expect(mocks.mockPutObjectCommand).toHaveBeenCalledWith({
        Bucket: process.env.REVIEWS_BUCKET,
        Key: 'reviews.json',
        Body: JSON.stringify(emptyArray, null, 2),
        ContentType: 'application/json',
      });
    });
  });

  describe('when S3 operation fails during save', () => {
    let s3Error: Error;

    beforeEach(() => {
      s3Error = new Error('S3 operation failed');
      mocks.mockS3Send.mockRejectedValue(s3Error);
    });

    it('should throw the error', async () => {
      await expect(saveReviews(mockReviews)).rejects.toThrow('S3 operation failed');
    });

    it('should call S3 send', async () => {
      try {
        await saveReviews(mockReviews);
      } catch {}
      expect(mocks.mockS3Send).toHaveBeenCalled();
    });
  });

  describe('when converting readable stream to string', () => {
    let testData: string;
    let mockStream: Readable;

    beforeEach(() => {
      testData = JSON.stringify([{ id: 'test' }]);
      mockStream = new Readable({
        read() {
          this.push(testData);
          this.push(null);
        },
      });
      mocks.mockS3Send.mockResolvedValue({
        Body: mockStream,
      });
    });

    it('should return parsed data', async () => {
      const result: Review[] = await loadReviews();
      expect(result).toEqual([{ id: 'test' }]);
    });

    it('should call S3 send', async () => {
      await loadReviews();
      expect(mocks.mockS3Send).toHaveBeenCalled();
    });
  });

  describe('when handling multi-chunk streams', () => {
    let validJson: string;
    let chunk1: string;
    let chunk2: string;
    let chunkIndex: number;
    let mockStream: Readable;

    beforeEach(() => {
      validJson = JSON.stringify([{ id: '1' }]);
      chunk1 = validJson.slice(0, 5);
      chunk2 = validJson.slice(5);
      chunkIndex = 0;

      mockStream = new Readable({
        read() {
          if (chunkIndex === 0) {
            this.push(chunk1);
            chunkIndex++;
          } else if (chunkIndex === 1) {
            this.push(chunk2);
            chunkIndex++;
          } else {
            this.push(null);
          }
        },
      });

      mocks.mockS3Send.mockResolvedValue({
        Body: mockStream,
      });
    });

    it('should return parsed data from multiple chunks', async () => {
      const result: Review[] = await loadReviews();
      expect(result).toEqual([{ id: '1' }]);
    });

    it('should call S3 send', async () => {
      await loadReviews();
      expect(mocks.mockS3Send).toHaveBeenCalled();
    });
  });
});
