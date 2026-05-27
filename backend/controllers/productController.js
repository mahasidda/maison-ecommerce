const Product = require('../models/Product');

const getProducts = async (req, res) => {
  try {
    const { category, search, sort, page = 1, limit = 12 } = req.query;
    const query = {};
    if (category) query.category = category;
    if (search) query.name = { $regex: search, $options: 'i' };
    const sortObj = sort === 'price_asc' ? { price: 1 }
      : sort === 'price_desc' ? { price: -1 }
      : sort === 'newest' ? { createdAt: -1 }
      : { isFeatured: -1 };
    const skip = (page - 1) * limit;
    const [products, total] = await Promise.all([
      Product.find(query).sort(sortObj).skip(skip).limit(Number(limit)),
      Product.countDocuments(query),
    ]);
    res.json({ products, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getProducts, getProduct, createProduct, updateProduct, deleteProduct };
