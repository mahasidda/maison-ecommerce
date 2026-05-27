const Razorpay = require('razorpay');
const crypto = require('crypto');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createOrder = async (req, res) => {
  try {
    const { amount } = req.body;
    const options = {
      amount: Math.round(amount * 100),
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    };
    const order = await razorpay.orders.create(options);
    console.log('Order created:', order.id);
    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error('Create order error:', err);
    res.status(500).json({ message: err.message });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Missing payment details' });
    }

    const secret = 'h25Us6MUpJutvb7p5XWTsR04';

    const body = razorpay_order_id + '|' + razorpay_payment_id;

    const expectedSign = crypto
      .createHmac('sha256', secret)
      .update(body)
      .digest('hex');

    console.log('Expected:', expectedSign);
    console.log('Received:', razorpay_signature);
    console.log('Match:', expectedSign === razorpay_signature);

    if (expectedSign === razorpay_signature) {
      return res.json({ success: true, paymentId: razorpay_payment_id });
    } else {
      return res.status(400).json({ success: false, message: 'Invalid signature' });
    }
  } catch (err) {
    console.error('Verify error:', err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createOrder, verifyPayment };