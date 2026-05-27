import { useEffect, useState } from 'react';
import { getAllOrders, updateOrderStatus } from '../../services/api';
import { toast } from 'react-toastify';
import './AdminOrders.css';

const STATUSES = ['pending','confirmed','shipped','delivered','cancelled'];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);

  const load = () => getAllOrders().then(({ data }) => setOrders(data));
  useEffect(() => { load(); }, []);

  const changeStatus = async (id, status) => {
    await updateOrderStatus(id, status);
    toast.success('Status updated');
    load();
  };

  return (
    <div>
      <h1 className="admin-page-title">Orders</h1>
      <div className="ao-table-wrap">
        <table className="ap-table">
          <thead>
            <tr><th>Order ID</th><th>Customer</th><th>Date</th><th>Amount</th><th>Items</th><th>Status</th></tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o._id}>
                <td><code style={{fontSize:12}}>#{o._id.slice(-8).toUpperCase()}</code></td>
                <td>
                  <div style={{fontWeight:500}}>{o.user?.name}</div>
                  <div style={{fontSize:12,color:'var(--muted)'}}>{o.user?.email}</div>
                </td>
                <td style={{fontSize:13,color:'var(--muted)'}}>
                  {new Date(o.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}
                </td>
                <td style={{fontWeight:600}}>₹{o.totalAmount.toLocaleString()}</td>
                <td style={{fontSize:13}}>
                  {o.items.map((i,idx) => <div key={idx}>{i.name} ×{i.quantity}</div>)}
                </td>
                <td>
                  <select
                    className="form-select ao-select"
                    value={o.status}
                    onChange={(e) => changeStatus(o._id, e.target.value)}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s} style={{textTransform:'capitalize'}}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
