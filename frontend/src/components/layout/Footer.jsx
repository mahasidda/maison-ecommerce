import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <span className="footer-logo">MAISON</span>
          <p>Thoughtfully crafted fashion for the modern wardrobe.</p>
        </div>
        <div className="footer-col">
          <h4>Shop</h4>
          <ul>
            <li><Link to="/products?category=women">Women</Link></li>
            <li><Link to="/products?category=men">Men</Link></li>
            <li><Link to="/products?category=accessories">Accessories</Link></li>
            <li><Link to="/coupons">Offers & Coupons</Link></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Help</h4>
          <ul>
            <li><Link to="/size-guide">Size Guide</Link></li>
            <li><Link to="/shipping">Shipping</Link></li>
            <li><Link to="/returns">Returns</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2026 MAISON. All rights reserved.</p>
      </div>
    </footer>
  );
}