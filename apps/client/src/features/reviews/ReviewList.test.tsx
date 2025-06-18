import { render, screen } from '@testing-library/react';
import ReviewList from '@/features/reviews/ReviewList';
import type { Review } from '@shared/models';

describe('#ReviewList', () => {
  describe('when there are no reviews', () => {
    beforeEach(() => {
      render(<ReviewList reviews={[]} />);
    });

    it('should render empty message', () => {
      expect(screen.getByText(/no reviews available/i)).toBeInTheDocument();
    });
  });

  describe('when there are reviews', () => {
    const mockReviews: Review[] = [
      {
        id: '1',
        author: 'Alice',
        title: 'Great',
        content: 'Amazing app!',
        score: 5,
        submittedAt: new Date().toISOString(),
      },
      {
        id: '2',
        author: 'Bob',
        title: 'Ok',
        content: 'Good enough',
        score: 4,
        submittedAt: new Date().toISOString(),
      },
    ];

    beforeEach(() => {
      render(<ReviewList reviews={mockReviews} />);
    });

    it('should render all reviews', () => {
      expect(screen.getByText('Alice')).toBeInTheDocument();
      expect(screen.getByText('Bob')).toBeInTheDocument();
    });

    it('should render review content', () => {
      expect(screen.getByText('Amazing app!')).toBeInTheDocument();
      expect(screen.getByText('Good enough')).toBeInTheDocument();
    });
  });
});
