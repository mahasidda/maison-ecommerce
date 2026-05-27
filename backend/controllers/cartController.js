const Cart = require('../models/Cart');

const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    res.json(cart || { items: [] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1, size, color } = req.body;
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) cart = new Cart({ user: req.user._id, items: [] });
    const existing = cart.items.find(
      (i) => i.product.toString() === productId && i.size === size
    );
    if (existing) existing.quantity += quantity;
    else cart.items.push({ product: productId, quantity, size, color });
    await cart.save();
    await cart.populate('items.product');
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateCartItem = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    const item = cart.items.id(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    item.quantity = req.body.quantity;
    await cart.save();
    await cart.populate('items.product');
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    cart.items = cart.items.filter((i) => i._id.toString() !== req.params.id);
    await cart.save();
    await cart.populate('items.product');
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart };
