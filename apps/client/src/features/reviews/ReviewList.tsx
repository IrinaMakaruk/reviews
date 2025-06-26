import React from 'react';
import ReviewCard from '@/components/ReviewCard/ReviewCard';
import type { ReviewListProps } from './types';
import '@/features/reviews/ReviewList.scss';
import { Review } from '@shared/models';

const ReviewList = ({ reviews }: ReviewListProps) => {
  if (!reviews.length) {
    return <p className="review-list__empty">No reviews available.</p>;
  }

  return (
    <div className="review-list">
      {reviews.map((review: Review) => (
        <ReviewCard key={review.id} review={review} />
      ))}
    </div>
  );
};

export default React.memo(ReviewList);
