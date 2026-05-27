import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './CartPage.css';

const PALETTE = ['#c8bfb0','#2c2825','#b8c4c0','#d4c4b8','#e8e0d0','#3a2e28','#b8a890','#c8d0c8'];

export default function CartPage() {
  const { cart, update, remove, total } = useCart();
  const navigate = useNavigate();

  if (cart.items.length === 0)
    return (
      <div className="cart-empty">
        <div style={{ fontSize: 60 }}>🛍</div>
        <h2>Your cart is empty</h2>
        <p>Looks like you haven't added anything yet.</p>
        <Link to="/products" className="btn btn-accent mt-3">Start Shopping</Link>
      </div>
    );

  return (
    <div className="cart-page">
      <h1 className="cart-title">Your Cart</h1>
      <div className="cart-layout">
        <div className="cart-items">
          {cart.items.map((item) => {
            const product = item.product;
            if (!product) return null;
            const colorIdx = product._id ? product._id.charCodeAt(product._id.length - 1) % PALETTE.length : 0;
            const bgColor = PALETTE[colorIdx];
            return (
              <div className="cart-item" key={item._id}>
                {/* Product Image */}
                <Link to={`/products/${product._id}`} className="cart-item-img-wrap">
                  {product.images?.[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="cart-item-img"
                    />
                  ) : (
                    <div className="cart-item-img-placeholder"
                      style={{ background: `linear-gradient(160deg, ${bgColor}dd, ${bgColor}88)` }}
                    />
                  )}
                </Link>

                {/* Product Info */}
                <div className="cart-item-info">
                  <div className="cart-item-brand">{product.brand}</div>
                  <Link to={`/products/${product._id}`} className="cart-item-name">
                    {product.name}
                  </Link>
                  {item.size && <div className="cart-item-meta">Size: {item.size}</div>}
                  {item.color && <div className="cart-item-meta">Color: {item.color}</div>}
                  <div className="cart-item-price">₹{product.price?.toLocaleString()}</div>
                </div>

                {/* Quantity + Remove */}
                <div className="cart-item-actions">
                  <div className="qty-group">
                    <button className="qty-btn"
                      onClick={() => item.quantity > 1 && update(item._id, item.quantity - 1)}>−</button>
                    <span className="qty-val">{item.quantity}</span>
                    <button className="qty-btn"
                      onClick={() => update(item._id, item.quantity + 1)}>+</button>
                  </div>
                  <div className="cart-item-subtotal">
                    ₹{(product.price * item.quantity).toLocaleString()}
                  </div>
                  <button className="cart-remove" onClick={() => remove(item._id)}>Remove</button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary */}
        <div className="cart-summary">
          <h3>Order Summary</h3>
          <div className="summary-row">
            <span>Subtotal ({cart.items.length} items)</span>
            <span>₹{total.toLocaleString()}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>{total > 2999 ? <span style={{ color: 'var(--success)' }}>Free</span> : '₹199'}</span>
          </div>
          {total < 2999 && (
            <div className="cart-free-shipping">
              Add ₹{(2999 - total).toLocaleString()} more for free shipping!
            </div>
          )}
          <div className="summary-row summary-total">
            <span>Total</span>
            <span>₹{(total > 2999 ? total : total + 199).toLocaleString()}</span>
          </div>
          <button
            className="btn btn-accent"
            style={{ width: '100%', justifyContent: 'center', padding: '1rem', marginTop: '.5rem' }}
            onClick={() => navigate('/checkout')}
          >
            Proceed to Checkout
          </button>
          <Link to="/products"
            className="btn btn-outline mt-2"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}