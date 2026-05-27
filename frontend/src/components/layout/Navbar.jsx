import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const { wishlist } = useWishlist();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const wishCount = wishlist?.products?.length || 0;
  const handleLogout = () => { logout(); navigate('/'); setMenuOpen(false); };
  const close = () => setMenuOpen(false);

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="navbar-logo" onClick={close}>MAISON</Link>

        <ul className="navbar-links">
          <li><Link to="/products?category=women">Women</Link></li>
          <li><Link to="/products?category=men">Men</Link></li>
          <li><Link to="/products?category=accessories">Accessories</Link></li>
          <li><Link to="/products">All</Link></li>
        </ul>

        <div className="navbar-actions">
          {user ? (
            <>
              {user.role === 'admin' && <Link to="/admin" className="nav-link">Admin</Link>}
              <Link to="/orders" className="nav-link">Orders</Link>
              <Link to="/profile" className="nav-link">Profile</Link>
              <button className="nav-link btn-plain" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-link">Register</Link>
            </>
          )}

          {/* Wishlist Icon */}
          <Link to="/wishlist" className="cart-btn" title="Wishlist" style={{ marginRight: '.2rem' }}>
            🤍
            {wishCount > 0 && <span className="cart-count">{wishCount}</span>}
          </Link>

          {/* Cart Icon */}
          <Link to="/cart" className="cart-btn">
            🛍
            {count > 0 && <span className="cart-count">{count}</span>}
          </Link>

          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            <span></span><span></span><span></span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        <Link to="/products?category=women" onClick={close}>Women</Link>
        <Link to="/products?category=men" onClick={close}>Men</Link>
        <Link to="/products?category=accessories" onClick={close}>Accessories</Link>
        <Link to="/products" onClick={close}>All Products</Link>
        {user ? (
          <>
            {user.role === 'admin' && <Link to="/admin" onClick={close}>Admin Panel</Link>}
            <Link to="/orders" onClick={close}>My Orders</Link>
            <Link to="/profile" onClick={close}>My Profile</Link>
            <Link to="/wishlist" onClick={close}>Wishlist {wishCount > 0 && `(${wishCount})`}</Link>
            <Link to="/cart" onClick={close}>Cart {count > 0 && `(${count})`}</Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" onClick={close}>Login</Link>
            <Link to="/register" onClick={close}>Register</Link>
            <Link to="/wishlist" onClick={close}>Wishlist</Link>
            <Link to="/cart" onClick={close}>Cart</Link>
          </>
        )}
      </div>
    </>
  );
}