import { useReviews } from '@/hooks/useReviews';
import ReviewList from '@/features/reviews/ReviewList';
import '@/pages/Home.scss';

const Home = () => {
  const { reviews, loading, error } = useReviews();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading reviews</p>;

  return (
    <section className="home-page">
      <ReviewList reviews={reviews} />
    </section>
  );
};

export default Home;
