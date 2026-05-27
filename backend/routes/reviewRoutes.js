const express = require('express');
const router = express.Router();
const { addReview, getReviews, deleteReview } = require('../controllers/reviewController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/:id/reviews', getReviews);
router.post('/:id/reviews', protect, addReview);
router.delete('/:id/reviews/:reviewId', protect, adminOnly, deleteReview);

module.exports = router;