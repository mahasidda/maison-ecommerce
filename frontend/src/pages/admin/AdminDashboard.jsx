import { useEffect, useState } from 'react';
import { getProducts, getAllOrders } from '../../services/api';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0, pending: 0, delivered: 0, cancelled: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [monthlySales, setMonthlySales] = useState([]);

  useEffect(() => {
    Promise.all([getProducts({ limit: 100 }), getAllOrders()]).then(([p, o]) => {
      const orders = o.data;
      const revenue = orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.totalAmount, 0);

      setStats({
        products: p.data.total,
        orders: orders.length,
        revenue,
        pending: orders.filter(o => o.status === 'pending').length,
        delivered: orders.filter(o => o.status === 'delivered').length,
        cancelled: orders.filter(o => o.status === 'cancelled').length,
      });

      setRecentOrders(orders.slice(0, 5));

      // Top products by order frequency
      const productCount = {};
      orders.forEach(order => {
        order.items.forEach(item => {
          productCount[item.name] = (productCount[item.name] || 0) + item.quantity;
        });
      });
      const sorted = Object.entries(productCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name, qty]) => ({ name, qty }));
      setTopProducts(sorted);

      // Monthly sales
      const monthly = {};
      orders.forEach(order => {
        const month = new Date(order.createdAt).toLocaleDateString('en-IN', { month: 'short', year: '2-digit' });
        monthly[month] = (monthly[month] || 0) + order.totalAmount;
      });
      const monthlyArr = Object.entries(monthly).map(([month, revenue]) => ({ month, revenue }));
      setMonthlySales(monthlyArr);
    });
  }, []);

  const statCards = [
    { label: 'Total Products', value: stats.products, icon: '👗', color: '#b5833a', bg: '#fef9f0' },
    { label: 'Total Orders', value: stats.orders, icon: '📦', color: '#2980b9', bg: '#f0f7ff' },
    { label: 'Total Revenue', value: `₹${stats.revenue.toLocaleString()}`, icon: '💰', color: '#27ae60', bg: '#f0faf5' },
    { label: 'Pending Orders', value: stats.pending, icon: '⏳', color: '#e67e22', bg: '#fff8f0' },
    { label: 'Delivered', value: stats.delivered, icon: '✅', color: '#27ae60', bg: '#f0faf5' },
    { label: 'Cancelled', value: stats.cancelled, icon: '❌', color: '#e74c3c', bg: '#fff5f5' },
  ];

  const maxRevenue = Math.max(...monthlySales.map(m => m.revenue), 1);
  const maxQty = Math.max(...topProducts.map(p => p.qty), 1);

  const STATUS_COLORS = {
    pending: '#f39c12', confirmed: '#2980b9',
    shipped: '#8e44ad', delivered: '#27ae60', cancelled: '#e74c3c',
  };

  return (
    <div className="admin-dashboard">
      <h1 className="admin-page-title">Dashboard</h1>

      {/* Stat Cards */}
      <div className="stat-grid">
        {statCards.map((c) => (
          <div className="stat-card" key={c.label} style={{ borderTop: `3px solid ${c.color}` }}>
            <div className="stat-icon" style={{ background: c.bg, color: c.color }}>{c.icon}</div>
            <div>
              <div className="stat-value">{c.value}</div>
              <div className="stat-label">{c.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">

        {/* Monthly Revenue Chart */}
        <div className="dashboard-card">
          <h3 className="dashboard-card-title">📈 Monthly Revenue</h3>
          {monthlySales.length === 0 ? (
            <p className="text-muted" style={{ padding: '2rem', textAlign: 'center' }}>No sales data yet</p>
          ) : (
            <div className="bar-chart">
              {monthlySales.map((m) => (
                <div className="bar-group" key={m.month}>
                  <div className="bar-wrap">
                    <div
                      className="bar"
                      style={{ height: `${(m.revenue / maxRevenue) * 150}px`, background: '#b5833a' }}
                      title={`₹${m.revenue.toLocaleString()}`}
                    />
                  </div>
                  <div className="bar-label">{m.month}</div>
                  <div className="bar-value">₹{(m.revenue / 1000).toFixed(1)}k</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Order Status Breakdown */}
        <div className="dashboard-card">
          <h3 className="dashboard-card-title">📊 Order Status</h3>
          <div className="status-breakdown">
            {[
              { label: 'Pending', value: stats.pending, key: 'pending' },
              { label: 'Delivered', value: stats.delivered, key: 'delivered' },
              { label: 'Cancelled', value: stats.cancelled, key: 'cancelled' },
            ].map((s) => (
              <div className="status-row" key={s.key}>
                <div className="status-row-label">
                  <span className="status-dot" style={{ background: STATUS_COLORS[s.key] }} />
                  {s.label}
                </div>
                <div className="status-bar-wrap">
                  <div
                    className="status-bar"
                    style={{
                      width: stats.orders ? `${(s.value / stats.orders) * 100}%` : '0%',
                      background: STATUS_COLORS[s.key],
                    }}
                  />
                </div>
                <div className="status-row-value">{s.value}</div>
              </div>
            ))}
          </div>

          <div className="revenue-highlight">
            <div className="revenue-highlight-label">Total Revenue</div>
            <div className="revenue-highlight-value">₹{stats.revenue.toLocaleString()}</div>
            <div className="revenue-highlight-sub">from {stats.orders - stats.cancelled} completed orders</div>
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="dashboard-card">
          <h3 className="dashboard-card-title">🏆 Top Selling Products</h3>
          {topProducts.length === 0 ? (
            <p className="text-muted" style={{ padding: '2rem', textAlign: 'center' }}>No sales data yet</p>
          ) : (
            <div className="top-products">
              {topProducts.map((p, idx) => (
                <div className="top-product-row" key={p.name}>
                  <div className="top-product-rank">{idx + 1}</div>
                  <div className="top-product-name">{p.name}</div>
                  <div className="top-product-bar-wrap">
                    <div
                      className="top-product-bar"
                      style={{ width: `${(p.qty / maxQty) * 100}%` }}
                    />
                  </div>
                  <div className="top-product-qty">{p.qty} sold</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Orders */}
        <div className="dashboard-card">
          <h3 className="dashboard-card-title">🕐 Recent Orders</h3>
          <table className="recent-orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length === 0 ? (
                <tr><td colSpan="4" style={{ textAlign: 'center', color: 'var(--muted)', padding: '1.5rem' }}>No orders yet</td></tr>
              ) : (
                recentOrders.map((o) => (
                  <tr key={o._id}>
                    <td><code style={{ fontSize: 11 }}>#{o._id.slice(-6).toUpperCase()}</code></td>
                    <td style={{ fontSize: 13 }}>{o.user?.name || 'User'}</td>
                    <td style={{ fontWeight: 600 }}>₹{o.totalAmount.toLocaleString()}</td>
                    <td>
                      <span style={{
                        background: STATUS_COLORS[o.status] + '22',
                        color: STATUS_COLORS[o.status],
                        padding: '.2rem .6rem', borderRadius: 20,
                        fontSize: 11, fontWeight: 600, textTransform: 'capitalize',
                      }}>
                        {o.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}