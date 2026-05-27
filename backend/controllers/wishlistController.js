const Wishlist = require('../models/Wishlist');

const getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id })
      .populate('products');
    res.json(wishlist || { products: [] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
      wishlist = new Wishlist({ user: req.user._id, products: [] });
    }
    if (wishlist.products.includes(productId)) {
      return res.status(400).json({ message: 'Already in wishlist' });
    }
    wishlist.products.push(productId);
    await wishlist.save();
    await wishlist.populate('products');
    res.json(wishlist);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const removeFromWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id });
    wishlist.products = wishlist.products.filter(
      (p) => p.toString() !== req.params.productId
    );
    await wishlist.save();
    await wishlist.populate('products');
    res.json(wishlist);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getWishlist, addToWishlist, removeFromWishlist };