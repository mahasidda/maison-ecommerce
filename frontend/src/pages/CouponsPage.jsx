import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import './CouponsPage.css';

const PUBLIC_COUPONS = [
  {
    code: 'SAVE20',
    discountType: 'percentage',
    discountValue: 20,
    minOrderAmount: 999,
    description: '20% off on orders above ₹999',
    expiryDate: '2026-12-31',
    icon: '🎉',
  },
  {
    code: 'FLAT200',
    discountType: 'fixed',
    discountValue: 200,
    minOrderAmount: 1999,
    description: '₹200 off on orders above ₹1,999',
    expiryDate: '2026-12-31',
    icon: '💰',
  },
  {
    code: 'NEWUSER',
    discountType: 'percentage',
    discountValue: 15,
    minOrderAmount: 0,
    description: '15% off for new users — no minimum order',
    expiryDate: '2026-12-31',
    icon: '👋',
  },
  {
    code: 'FASHION30',
    discountType: 'percentage',
    discountValue: 30,
    minOrderAmount: 4999,
    description: '30% off on orders above ₹4,999',
    expiryDate: '2026-12-31',
    icon: '👗',
  },
  {
    code: 'FREESHIP',
    discountType: 'fixed',
    discountValue: 199,
    minOrderAmount: 0,
    description: 'Free shipping on any order',
    expiryDate: '2026-12-31',
    icon: '🚚',
  },
];

export default function CouponsPage() {
  const [copied, setCopied] = useState('');

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    toast.success(`Coupon code "${code}" copied! 🎉`);
    setTimeout(() => setCopied(''), 2000);
  };

  return (
    <div className="coupons-page">
      <div className="coupons-header">
        <h1 className="coupons-title">Offers & <em>Coupons</em></h1>
        <p className="coupons-sub">Copy a coupon code and apply it at checkout to save on your order!</p>
      </div>

      <div className="coupons-grid">
        {PUBLIC_COUPONS.map((coupon) => (
          <div className="coupon-card" key={coupon.code}>
            <div className="coupon-left">
              <div className="coupon-icon">{coupon.icon}</div>
              <div className="coupon-discount">
                {coupon.discountType === 'percentage'
                  ? `${coupon.discountValue}% OFF`
                  : `₹${coupon.discountValue} OFF`}
              </div>
            </div>
            <div className="coupon-divider">
              <div className="coupon-notch top" />
              <div className="coupon-dash" />
              <div className="coupon-notch bottom" />
            </div>
            <div className="coupon-right">
              <div className="coupon-description">{coupon.description}</div>
              {coupon.minOrderAmount > 0 && (
                <div className="coupon-min">Min order: ₹{coupon.minOrderAmount.toLocaleString()}</div>
              )}
              <div className="coupon-expiry">
                Valid till {new Date(coupon.expiryDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
              <div className="coupon-code-wrap">
                <span className="coupon-code">{coupon.code}</span>
                <button
                  className={`coupon-copy ${copied === coupon.code ? 'copied' : ''}`}
                  onClick={() => handleCopy(coupon.code)}
                >
                  {copied === coupon.code ? '✅ Copied!' : 'Copy Code'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="coupons-how">
        <h2>How to use a coupon?</h2>
        <div className="how-steps">
          <div className="how-step">
            <div className="how-num">1</div>
            <div className="how-text">Copy the coupon code</div>
          </div>
          <div className="how-arrow">→</div>
          <div className="how-step">
            <div className="how-num">2</div>
            <div className="how-text">Add products to cart</div>
          </div>
          <div className="how-arrow">→</div>
          <div className="how-step">
            <div className="how-num">3</div>
            <div className="how-text">Go to checkout</div>
          </div>
          <div className="how-arrow">→</div>
          <div className="how-step">
            <div className="how-num">4</div>
            <div className="how-text">Paste code & click Apply</div>
          </div>
        </div>
      </div>
    </div>
  );
}