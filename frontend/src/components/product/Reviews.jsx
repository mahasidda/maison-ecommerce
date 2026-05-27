import { useEffect, useState } from 'react';
import { getReviews, addReview } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import './Reviews.css';

const StarRating = ({ rating, onRate, interactive = false }) => {
  const [hover, setHover] = useState(0);
  return (
    <div className="stars">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`star ${star <= (hover || rating) ? 'filled' : ''} ${interactive ? 'interactive' : ''}`}
          onClick={() => interactive && onRate(star)}
          onMouseEnter={() => interactive && setHover(star)}
          onMouseLeave={() => interactive && setHover(0)}
        >★</span>
      ))}
    </div>
  );
};

export default function Reviews({ productId }) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const load = () => getReviews(productId).then(({ data }) => setReviews(data));
  useEffect(() => { load(); }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) { toast.error('Please select a rating!'); return; }
    setLoading(true);
    try {
      await addReview(productId, { rating, comment });
      toast.success('Review added! ⭐');
      setRating(0);
      setComment('');
      setShowForm(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add review');
    } finally { setLoading(false); }
  };

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div className="reviews-section">
      <div className="reviews-header">
        <div>
          <h2 className="reviews-title">Customer Reviews</h2>
          {reviews.length > 0 && (
            <div className="reviews-summary">
              <span className="avg-rating">{avgRating}</span>
              <StarRating rating={Math.round(avgRating)} />
              <span className="review-count">({reviews.length} reviews)</span>
            </div>
          )}
        </div>
        {user && !showForm && (
          <button className="btn btn-outline btn-sm" onClick={() => setShowForm(true)}>
            Write a Review
          </button>
        )}
        {!user && (
          <p className="text-muted" style={{ fontSize: 13 }}>
            <a href="/login" style={{ color: 'var(--accent)' }}>Login</a> to write a review
          </p>
        )}
      </div>

      {/* Review Form */}
      {showForm && (
        <form className="review-form" onSubmit={handleSubmit}>
          <h3>Your Review</h3>
          <div className="form-group">
            <label className="form-label">Rating</label>
            <StarRating rating={rating} onRate={setRating} interactive={true} />
          </div>
          <div className="form-group">
            <label className="form-label">Comment</label>
            <textarea
              className="form-input"
              rows="4"
              placeholder="Share your experience with this product..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
              style={{ resize: 'vertical' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn btn-accent" type="submit" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Review'}
            </button>
            <button className="btn btn-outline" type="button" onClick={() => setShowForm(false)}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="no-reviews">
          <p>No reviews yet. Be the first to review this product!</p>
        </div>
      ) : (
        <div className="reviews-list">
          {reviews.map((review) => (
            <div className="review-card" key={review._id}>
              <div className="review-top">
                <div className="review-avatar">
                  {review.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="review-name">{review.name}</div>
                  <div className="review-date">
                    {new Date(review.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'long', year: 'numeric'
                    })}
                  </div>
                </div>
                <div style={{ marginLeft: 'auto' }}>
                  <StarRating rating={review.rating} />
                </div>
              </div>
              <p className="review-comment">{review.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}