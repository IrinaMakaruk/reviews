import ReviewCard from '@/components/ReviewCard/ReviewCard'
import type { ReviewListProps } from './types'
import '@/features/reviews/ReviewList.scss'

export default function ReviewList({ reviews }: ReviewListProps) {
  return (
    <div className="review-list">
      {reviews.map((review) => (
        <ReviewCard key={review.id} review={review} />
      ))}
    </div>
  )
}
