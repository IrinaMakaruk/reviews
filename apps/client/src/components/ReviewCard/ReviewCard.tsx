import { Card, Rate } from 'antd'
import type { ReviewCardProps } from './types'
import './ReviewCard.scss'

export default function ReviewCard({ review }: ReviewCardProps) {
  return (
    <Card className="review-card">
      <div className="review-card__header">
        <strong>{review.author}</strong>
        <small>{new Date(review.submittedAt).toLocaleString()}</small>
      </div>
      <Rate disabled defaultValue={review.score} />
      <p className="review-card__content">{review.content}</p>
    </Card>
  )
}
