const Order = require('../models/Order');
const Cart = require('../models/Cart');
const User = require('../models/User');
const { sendOrderConfirmation, sendOrderDelivered, sendAdminOrderAlert } = require('../utils/sendEmail');

const placeOrder = async (req, res) => {
  try {
    const { shippingAddress, paymentMethod, items, totalAmount, paymentId } = req.body;
    const order = await Order.create({
      user: req.user._id,
      items,
      shippingAddress,
      paymentMethod,
      paymentId: paymentId || '',
      isPaid: paymentMethod === 'Razorpay' ? true : false,
      totalAmount,
    });
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });
    try {
      await sendOrderConfirmation(order, req.user.email, req.user.name);
      await sendAdminOrderAlert(order, req.user.email);
    } catch (emailErr) {
      console.error('Email error:', emailErr.message);
    }
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (req.body.status === 'delivered') {
      try {
        const user = await User.findById(order.user);
        if (user) {
          await sendOrderDelivered(order, user.email, user.name);
        }
      } catch (emailErr) {
        console.error('Delivered email error:', emailErr.message);
      }
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { placeOrder, getMyOrders, getAllOrders, updateOrderStatus };