import './InfoPages.css';

export default function ReturnsPage() {
  return (
    <div className="info-page">
      <div className="info-container">
        <h1 className="info-title">Returns & Exchanges</h1>
        <p className="info-subtitle">Easy returns within 14 days of delivery.</p>

        <div className="info-card">
          <h2 className="info-section-title">Return Policy</h2>
          <p>We accept returns within <strong>14 days</strong> of delivery. Items must be unworn, unwashed, and in their original packaging with all tags attached.</p>
        </div>

        <div className="info-card">
          <h2 className="info-section-title">Items Eligible for Return</h2>
          <ul className="info-list">
            <li>✅ Clothing in original condition with tags</li>
            <li>✅ Accessories in original packaging</li>
            <li>✅ Items with manufacturing defects</li>
            <li>❌ Items that have been worn or washed</li>
            <li>❌ Sale items marked as final sale</li>
            <li>❌ Innerwear and swimwear</li>
          </ul>
        </div>

        <div className="info-card">
          <h2 className="info-section-title">How to Return</h2>
          <ol className="info-list">
            <li>1. Log in to your account and go to <strong>My Orders</strong></li>
            <li>2. Select the item you wish to return</li>
            <li>3. Choose your reason for return</li>
            <li>4. Pack the item securely in original packaging</li>
            <li>5. Our courier will pick it up within 2–3 business days</li>
          </ol>
        </div>

        <div className="info-card">
          <h2 className="info-section-title">Refund Timeline</h2>
          <table className="size-table">
            <thead>
              <tr><th>Payment Method</th><th>Refund Time</th></tr>
            </thead>
            <tbody>
              <tr><td>UPI / Net Banking</td><td>3–5 business days</td></tr>
              <tr><td>Credit / Debit Card</td><td>5–7 business days</td></tr>
              <tr><td>Cash on Delivery</td><td>Store credit within 2 days</td></tr>
            </tbody>
          </table>
        </div>

        <div className="info-tip">
          <strong>Questions?</strong> Contact our support team at <strong>support@maison.com</strong> or visit our Contact page.
        </div>
      </div>
    </div>
  );
}