import { render, screen } from '@testing-library/react';
import ReviewCard from './ReviewCard';
import type { Review } from '@shared/models';
import { formatDate } from '@/lib/date';

const mockReview: Review = {
  id: 'r1',
  author: 'Jane Doe',
  title: '',
  content: 'Amazing experience!',
  score: 5,
  submittedAt: '2024-06-16T12:00:00Z',
};

describe('#ReviewCard', () => {
  beforeEach(() => {
    render(<ReviewCard review={mockReview} />);
  });

  it('should render author name', () => {
    expect(screen.getByText(mockReview.author)).toBeInTheDocument();
  });

  it('should render formatted submitted date', () => {
    expect(screen.getByText(formatDate(mockReview.submittedAt))).toBeInTheDocument();
  });

  it('should render review content', () => {
    expect(screen.getByText(mockReview.content)).toBeInTheDocument();
  });

  it('should render rating as stars', () => {
    const filledStars = document.querySelectorAll('.ant-rate-star-full');
    expect(filledStars.length).toBe(mockReview.score);
  });
});
