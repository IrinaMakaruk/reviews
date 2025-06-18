import { useEffect, useState } from 'react'
import { getRecentReviews } from '@/services/reviewService'
import ReviewList from '@/features/reviews/ReviewList'
import '@/pages/Home.scss'

import type { Review } from '@shared/models'

export default function Home() {
  const [reviews, setReviews] = useState<Review[]>([])

  useEffect(() => {
    getRecentReviews().then(setReviews).catch(console.error)
  }, [])

  return (
    <section className="home-page">
      <ReviewList reviews={reviews} />
    </section>
  )
}
