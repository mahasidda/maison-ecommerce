import './InfoPages.css';

export default function ShippingPage() {
  return (
    <div className="info-page">
      <div className="info-container">
        <h1 className="info-title">Shipping Policy</h1>
        <p className="info-subtitle">We deliver across India with care and speed.</p>

        <div className="info-card">
          <h2 className="info-section-title">Delivery Options</h2>
          <table className="size-table">
            <thead>
              <tr><th>Type</th><th>Estimated Time</th><th>Cost</th></tr>
            </thead>
            <tbody>
              <tr><td>Standard Delivery</td><td>5–7 business days</td><td>₹199</td></tr>
              <tr><td>Express Delivery</td><td>2–3 business days</td><td>₹399</td></tr>
              <tr><td>Free Shipping</td><td>5–7 business days</td><td>Free on orders above ₹2,999</td></tr>
            </tbody>
          </table>
        </div>

        <div className="info-card">
          <h2 className="info-section-title">Order Processing</h2>
          <p>Orders are processed within <strong>1–2 business days</strong> after payment confirmation. You will receive an email with your tracking details once your order is shipped.</p>
        </div>

        <div className="info-card">
          <h2 className="info-section-title">Delivery Areas</h2>
          <p>We currently deliver to all major cities and towns across India including Mumbai, Delhi, Bengaluru, Hyderabad, Chennai, Kolkata, Pune, and more.</p>
        </div>

        <div className="info-card">
          <h2 className="info-section-title">Tracking Your Order</h2>
          <p>Once your order is shipped, you can track it by logging into your account and visiting <strong>My Orders</strong>. A tracking link will also be sent to your registered email.</p>
        </div>

        <div className="info-tip">
          <strong>Note:</strong> Delivery times may vary during sale periods, public holidays, or due to unforeseen circumstances.
        </div>
      </div>
    </div>
  );
}