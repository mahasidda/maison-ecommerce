import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AdminLayout.css';

export default function AdminLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-logo">MAISON<br /><span>Admin</span></div>
        <nav className="admin-nav">
          <NavLink to="/admin" end className={({isActive}) => isActive ? 'admin-link active' : 'admin-link'}>📊 Dashboard</NavLink>
          <NavLink to="/admin/products" className={({isActive}) => isActive ? 'admin-link active' : 'admin-link'}>👗 Products</NavLink>
          <NavLink to="/admin/orders" className={({isActive}) => isActive ? 'admin-link active' : 'admin-link'}>📦 Orders</NavLink>
          <NavLink to="/admin/coupons" className={({isActive}) => isActive ? 'admin-link active' : 'admin-link'}>🏷️ Coupons</NavLink>
          <NavLink to="/" className="admin-link">🏠 View Store</NavLink>
        </nav>
        <button className="admin-logout" onClick={() => { logout(); navigate('/'); }}>Sign Out</button>
      </aside>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
