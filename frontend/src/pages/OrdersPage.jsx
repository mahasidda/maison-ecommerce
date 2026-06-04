import { useEffect, useState } from 'react';
import { getMyOrders } from '../services/api';
import './OrdersPage.css';

const STATUS_STEPS = ['pending', 'confirmed', 'shipped', 'delivered'];

const STATUS_INFO = {
  pending:   { icon: '🛍', label: 'Order Placed',  color: '#f39c12' },
  confirmed: { icon: '✅', label: 'Confirmed',      color: '#2980b9' },
  shipped:   { icon: '🚚', label: 'Shipped',        color: '#8e44ad' },
  delivered: { icon: '📦', label: 'Delivered',      color: '#27ae60' },
  cancelled: { icon: '❌', label: 'Cancelled',      color: '#e74c3c' },
};

function OrderTimeline({ status }) {
  if (status === 'cancelled') {
    return (
      <div className="timeline-cancelled">
        <span>❌</span> Order Cancelled
      </div>
    );
  }
  const currentIdx = STATUS_STEPS.indexOf(status);
  return (
    <div className="timeline">
      {STATUS_STEPS.map((step, idx) => {
        const info = STATUS_INFO[step];
        const isDone = idx <= currentIdx;
        const isCurrent = idx === currentIdx;
        return (
          <div key={step} className="timeline-step">
            <div className={`timeline-icon ${isDone ? 'done' : ''} ${isCurrent ? 'current' : ''}`}
              style={{ borderColor: isDone ? info.color : '#ddd', background: isDone ? info.color : '#fff' }}>
              {isDone ? info.icon : <span style={{ color: '#ddd' }}>{info.icon}</span>}
            </div>
            <div className={`timeline-label ${isDone ? 'done' : ''}`}>{info.label}</div>
            {idx < STATUS_STEPS.length - 1 && (
              <div className={`timeline-line ${idx < currentIdx ? 'done' : ''}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    getMyOrders().then(({ data }) => setOrders(data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-loader"><div className="spinner" /></div>;

  return (
    <div className="orders-page">
      <h1 className="orders-title">My Orders</h1>
      {orders.length === 0 ? (
        <div className="orders-empty">
          <div style={{ fontSize: 60 }}>📦</div>
          <h2>No orders yet</h2>
          <p>You haven't placed any orders yet.</p>
          <a href="/products" className="btn btn-accent mt-3">Start Shopping</a>
        </div>
      ) : (
        orders.map((order) => (
          <div className="order-card" key={order._id}>
            <div className="order-header" onClick={() => setExpanded(expanded === order._id ? null : order._id)}>
              <div>
                <div className="order-id">Order #{order._id.slice(-8).toUpperCase()}</div>
                <div className="order-date">
                  {new Date(order.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'long', year: 'numeric'
                  })}
                </div>
              </div>
              <div className="order-right">
                <span className={`badge badge-${order.status}`}>
                  {STATUS_INFO[order.status]?.icon} {STATUS_INFO[order.status]?.label}
                </span>
                <div className="order-total">₹{order.totalAmount.toLocaleString()}</div>
                <div className="order-expand">{expanded === order._id ? '▲' : '▼'}</div>
              </div>
            </div>

            <div className="order-timeline-wrap">
              <OrderTimeline status={order.status} />
            </div>

            {expanded === order._id && (
              <div className="order-details">
                <div className="order-items">
                  <h4>Items Ordered</h4>
                  {order.items.map((item, i) => (
                    <div className="order-item" key={i}>
                      <div className="order-item-img-wrap">
                        {item.image ? (
                          <img src={item.image} alt={item.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 4 }} />
                        ) : (
                          <div style={{ width: '100%', height: '100%', background: '#f0ece6', borderRadius: 4 }} />
                        )}
                      </div>
                      <div className="order-item-info">
                        <div className="order-item-name">{item.name}</div>
                        <div className="order-item-meta">
                          Qty: {item.quantity}
                          {item.size && ` · Size: ${item.size}`}
                        </div>
                        <div className="order-item-price">₹{(item.price * item.quantity).toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="order-summary-box">
                  <h4>Order Summary</h4>
                  <div className="summary-row">
                    <span>Payment</span>
                    <span>{order.paymentMethod} {order.isPaid ? '✅' : ''}</span>
                  </div>
                  <div className="summary-row">
                    <span>Total</span>
                    <span><strong>₹{order.totalAmount.toLocaleString()}</strong></span>
                  </div>
                  <h4 style={{ marginTop: '1.5rem' }}>Shipping Address</h4>
                  <p className="order-address-text">
                    {order.shippingAddress.name}<br />
                    {order.shippingAddress.street}<br />
                    {order.shippingAddress.city}, {order.shippingAddress.state} — {order.shippingAddress.pincode}<br />
                    📞 {order.shippingAddress.phone}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}