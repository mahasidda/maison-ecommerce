import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { placeOrder, createRazorpayOrder, verifyRazorpayPayment, applyCoupon } from '../services/api';
import { toast } from 'react-toastify';
import './CheckoutPage.css';

export default function CheckoutPage() {
  const { cart, total, fetchCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponLoading, setCouponLoading] = useState(false);
  const [form, setForm] = useState({
    name: '', street: '', city: '', state: '', pincode: '', phone: ''
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const shipping = total > 2999 ? 0 : 199;
  const grandTotal = total + shipping - couponDiscount;

  const handleApplyCoupon = async () => {
    if (!couponCode) { toast.error('Please enter a coupon code'); return; }
    setCouponLoading(true);
    try {
      const { data } = await applyCoupon({ code: couponCode, orderAmount: total + shipping });
      setCouponDiscount(data.discount);
      setCouponApplied(true);
      toast.success(data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid coupon');
      setCouponDiscount(0);
      setCouponApplied(false);
    } finally { setCouponLoading(false); }
  };

  const removeCoupon = () => {
    setCouponCode('');
    setCouponDiscount(0);
    setCouponApplied(false);
    toast.info('Coupon removed');
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) { resolve(true); return; }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const placeOrderInDB = async (method, paymentId = '') => {
    const items = cart.items.map((i) => ({
      product: i.product._id,
      name: i.product.name,
      price: i.product.price,
      quantity: i.quantity,
      size: i.size,
      color: i.color,
    }));
    await placeOrder({
      shippingAddress: form,
      paymentMethod: method,
      paymentId,
      items,
      totalAmount: grandTotal,
      couponCode: couponApplied ? couponCode : '',
      discount: couponDiscount,
    });
    await fetchCart();
    toast.success('Order placed successfully! 🎉');
    navigate('/orders');
  };

  const handleRazorpay = async () => {
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) { toast.error('Razorpay failed to load'); return; }

    try {
      const { data } = await createRazorpayOrder({ amount: grandTotal });
      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: 'MAISON',
        description: 'Fashion Purchase',
        order_id: data.orderId,
        handler: async (response) => {
          try {
            const verify = await verifyRazorpayPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            if (verify.data.success) {
              await placeOrderInDB('Razorpay', response.razorpay_payment_id);
            } else {
              toast.error('Payment verification failed');
            }
          } catch (err) {
            toast.error('Verification error: ' + (err?.response?.data?.message || err.message));
          }
        },
        modal: { ondismiss: () => { toast.info('Payment cancelled'); setLoading(false); } },
        prefill: { name: form.name, contact: form.phone },
        theme: { color: '#b5833a' },
      };
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (response) => {
        toast.error('Payment failed: ' + response.error.description);
        setLoading(false);
      });
      rzp.open();
    } catch (err) {
      toast.error('Failed to create payment order');
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (paymentMethod === 'Razorpay') await handleRazorpay();
      else { await placeOrderInDB('COD'); setLoading(false); }
    } catch {
      toast.error('Failed to place order');
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page">
      <h1 className="checkout-title">Checkout</h1>
      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <h3>Shipping Address</h3>
          {[
            { name: 'name', label: 'Full Name', placeholder: 'John Doe' },
            { name: 'phone', label: 'Phone Number', placeholder: '9876543210' },
            { name: 'street', label: 'Street Address', placeholder: '123 MG Road' },
            { name: 'city', label: 'City', placeholder: 'Hyderabad' },
            { name: 'state', label: 'State', placeholder: 'Telangana' },
            { name: 'pincode', label: 'Pincode', placeholder: '500032' },
          ].map((f) => (
            <div className="form-group" key={f.name}>
              <label className="form-label">{f.label}</label>
              <input className="form-input" name={f.name} placeholder={f.placeholder}
                value={form[f.name]} onChange={handleChange} required />
            </div>
          ))}

          <div className="form-group">
            <label className="form-label">Payment Method</label>
            <div className="payment-options">
              <label className={`payment-option ${paymentMethod === 'COD' ? 'active' : ''}`}>
                <input type="radio" name="payment" value="COD"
                  checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} />
                💵 Cash on Delivery
              </label>
              <label className={`payment-option ${paymentMethod === 'Razorpay' ? 'active' : ''}`}>
                <input type="radio" name="payment" value="Razorpay"
                  checked={paymentMethod === 'Razorpay'} onChange={() => setPaymentMethod('Razorpay')} />
                💳 Pay Online (Razorpay)
              </label>
            </div>
          </div>

          <button className="btn btn-accent" type="submit" disabled={loading}
            style={{ width: '100%', justifyContent: 'center', padding: '1rem' }}>
            {loading ? 'Processing...' : paymentMethod === 'Razorpay'
              ? `Pay Now ₹${grandTotal.toLocaleString()}` : 'Place Order'}
          </button>
        </form>

        <div className="checkout-summary">
          <h3>Order Summary</h3>
          {cart.items.map((item) => (
            <div className="checkout-item" key={item._id}>
              <div>
                <div className="checkout-item-name">{item.product?.name}</div>
                <div className="checkout-item-meta">Qty: {item.quantity} {item.size && `· ${item.size}`}</div>
              </div>
              <div>₹{(item.product?.price * item.quantity).toLocaleString()}</div>
            </div>
          ))}

          <div className="summary-row" style={{ marginTop: '1rem' }}>
            <span>Subtotal</span><span>₹{total.toLocaleString()}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>{shipping === 0 ? <span style={{ color: 'var(--success)' }}>Free</span> : `₹${shipping}`}</span>
          </div>

          {/* Coupon Section */}
          <div className="coupon-section">
            <label className="form-label">Coupon Code</label>
            {!couponApplied ? (
              <div className="coupon-input-wrap">
                <input
                  className="form-input"
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  style={{ flex: 1 }}
                />
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={handleApplyCoupon}
                  disabled={couponLoading}
                >
                  {couponLoading ? '...' : 'Apply'}
                </button>
              </div>
            ) : (
              <div className="coupon-applied">
                <span>✅ <strong>{couponCode}</strong> applied! You save ₹{couponDiscount.toLocaleString()}</span>
                <button type="button" className="coupon-remove" onClick={removeCoupon}>✕</button>
              </div>
            )}
          </div>

          {couponDiscount > 0 && (
            <div className="summary-row" style={{ color: 'var(--success)' }}>
              <span>Discount</span><span>− ₹{couponDiscount.toLocaleString()}</span>
            </div>
          )}

          <div className="checkout-total">
            <span>Total</span>
            <span>₹{grandTotal.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}