const Product = require('../models/Product');

const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );
    if (alreadyReviewed)
      return res.status(400).json({ message: 'You have already reviewed this product' });

    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length;

    await product.save();
    res.status(201).json({ message: 'Review added successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getReviews = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('reviews.user', 'name');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product.reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteReview = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    product.reviews = product.reviews.filter(
      (r) => r._id.toString() !== req.params.reviewId
    );
    product.numReviews = product.reviews.length;
    product.rating = product.reviews.length > 0
      ? product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length
      : 0;
    await product.save();
    res.json({ message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { addReview, getReviews, deleteReview };