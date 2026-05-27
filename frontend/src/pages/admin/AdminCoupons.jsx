import { useEffect, useState } from 'react';
import { getAllCoupons, createCoupon, updateCoupon, deleteCoupon } from '../../services/api';
import { toast } from 'react-toastify';

const EMPTY = {
  code: '', discountType: 'percentage', discountValue: '',
  minOrderAmount: '', maxUses: '100', isActive: true,
  expiryDate: '',
};

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = () => getAllCoupons().then(({ data }) => setCoupons(data));
  useEffect(() => { load(); }, []);

  const openCreate = () => { setForm(EMPTY); setEditing(null); setShowForm(true); };
  const openEdit = (c) => {
    setForm({ ...c, expiryDate: new Date(c.expiryDate).toISOString().split('T')[0] });
    setEditing(c._id); setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      if (editing) await updateCoupon(editing, form);
      else await createCoupon(form);
      toast.success(editing ? 'Coupon updated!' : 'Coupon created!');
      setShowForm(false); load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save coupon');
    } finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this coupon?')) return;
    await deleteCoupon(id);
    toast.success('Coupon deleted');
    load();
  };

  const handleToggle = async (coupon) => {
    await updateCoupon(coupon._id, { isActive: !coupon.isActive });
    toast.success(`Coupon ${!coupon.isActive ? 'activated' : 'deactivated'}`);
    load();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 className="admin-page-title" style={{ margin: 0 }}>Coupons</h1>
        <button className="btn btn-accent btn-sm" onClick={openCreate}>+ Create Coupon</button>
      </div>

      {showForm && (
        <div className="ap-form-wrap" style={{ marginBottom: '2rem' }}>
          <h3>{editing ? 'Edit Coupon' : 'New Coupon'}</h3>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 2rem' }}>
            <div className="form-group">
              <label className="form-label">Coupon Code</label>
              <input className="form-input" placeholder="e.g. SAVE20" value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Discount Type</label>
              <select className="form-select" value={form.discountType}
                onChange={(e) => setForm({ ...form, discountType: e.target.value })}>
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount (₹)</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">
                Discount Value {form.discountType === 'percentage' ? '(%)' : '(₹)'}
              </label>
              <input className="form-input" type="number" placeholder={form.discountType === 'percentage' ? '20' : '200'}
                value={form.discountValue} onChange={(e) => setForm({ ...form, discountValue: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Min Order Amount (₹)</label>
              <input className="form-input" type="number" placeholder="500"
                value={form.minOrderAmount} onChange={(e) => setForm({ ...form, minOrderAmount: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Max Uses</label>
              <input className="form-input" type="number" placeholder="100"
                value={form.maxUses} onChange={(e) => setForm({ ...form, maxUses: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Expiry Date</label>
              <input className="form-input" type="date"
                value={form.expiryDate} onChange={(e) => setForm({ ...form, expiryDate: e.target.value })} required />
            </div>
            <div style={{ gridColumn: 'span 2', display: 'flex', gap: '1rem', paddingTop: '.5rem' }}>
              <button className="btn btn-accent" type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Save Coupon'}
              </button>
              <button className="btn btn-outline" type="button" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="ap-table-wrap">
        <table className="ap-table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Discount</th>
              <th>Min Order</th>
              <th>Uses</th>
              <th>Expiry</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((c) => (
              <tr key={c._id}>
                <td><strong style={{ letterSpacing: '0.1em' }}>{c.code}</strong></td>
                <td>
                  {c.discountType === 'percentage' ? `${c.discountValue}% off` : `₹${c.discountValue} off`}
                </td>
                <td>₹{c.minOrderAmount || 0}</td>
                <td>{c.usedCount} / {c.maxUses}</td>
                <td style={{ fontSize: 13 }}>
                  {new Date(c.expiryDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </td>
                <td>
                  <button
                    className={`btn btn-sm ${c.isActive ? 'btn-accent' : 'btn-outline'}`}
                    onClick={() => handleToggle(c)}
                  >
                    {c.isActive ? '✅ Active' : '❌ Inactive'}
                  </button>
                </td>
                <td>
                  <button className="btn btn-outline btn-sm" onClick={() => openEdit(c)} style={{ marginRight: '.5rem' }}>Edit</button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(c._id)}>Delete</button>
                </td>
              </tr>
            ))}
            {coupons.length === 0 && (
              <tr><td colSpan="7" style={{ textAlign: 'center', color: 'var(--muted)', padding: '2rem' }}>No coupons yet. Create one!</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}