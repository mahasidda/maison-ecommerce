import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../services/api';
import ProductCard from '../components/product/ProductCard';
import './HomePage.css';

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [counts, setCounts] = useState({ women: 0, men: 0, accessories: 0 });

  useEffect(() => {
    // Get featured products
    getProducts({ limit: 4 }).then(({ data }) => setFeatured(data.products));

    // Get real counts for each category
    Promise.all([
      getProducts({ category: 'women', limit: 1 }),
      getProducts({ category: 'men', limit: 1 }),
      getProducts({ category: 'accessories', limit: 1 }),
    ]).then(([w, m, a]) => {
      setCounts({
        women: w.data.total,
        men: m.data.total,
        accessories: a.data.total,
      });
    });
  }, []);

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero-left">
          <div className="hero-label">SS 2026 Collection</div>
          <h1 className="hero-title">Wear your <em>story.</em></h1>
          <p className="hero-sub">
            Timeless silhouettes crafted from the finest sustainable fabrics.
            Where heritage meets the modern wardrobe.
          </p>
          <Link to="/products" className="btn btn-accent hero-btn">
            Explore Collection →
          </Link>
        </div>
        <div className="hero-right">
          <div className="hero-img" />
          <div className="hero-tag">New Arrivals</div>
          <div className="hero-year">SS<br />26</div>
        </div>
      </section>

      {/* Marquee */}
      <div className="marquee-wrap">
        <div className="marquee">
          {['New Collection','Free Shipping Over ₹2999','Sustainable Fabrics','Easy Returns','SS 2026 Lookbook',
            'New Collection','Free Shipping Over ₹2999','Sustainable Fabrics','Easy Returns','SS 2026 Lookbook'].map((t, i) => (
            <span key={i}>{t} <span className="dot">◆</span> </span>
          ))}
        </div>
      </div>

      {/* Categories */}
      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Shop by <em>Category</em></h2>
        </div>
        <div className="cat-grid">
          <Link to="/products?category=women" className="cat-card">
            <img
              src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80"
              alt="Women's Wear"
              className="cat-img"
            />
            <div className="cat-label">
              <div className="cat-name">Women's Wear</div>
              <div className="cat-count">{counts.women} pieces</div>
            </div>
          </Link>
          <Link to="/products?category=men" className="cat-card">
            <img
              src="https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=800&q=80"
              alt="Men's"
              className="cat-img"
            />
            <div className="cat-label">
              <div className="cat-name">Men's</div>
              <div className="cat-count">{counts.men} pieces</div>
            </div>
          </Link>
          <Link to="/products?category=accessories" className="cat-card">
            <img
              src="https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80"
              alt="Accessories"
              className="cat-img"
            />
            <div className="cat-label">
              <div className="cat-name">Accessories</div>
              <div className="cat-count">{counts.accessories} pieces</div>
            </div>
          </Link>
        </div>
      </section>

      {/* Featured */}
      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Featured <em>Picks</em></h2>
          <Link to="/products" className="section-link">View all →</Link>
        </div>
        <div className="product-grid-4">
          {featured.map((p) => <ProductCard key={p._id} product={p} />)}
        </div>
      </section>

      {/* Banner */}
      <section className="newsletter-banner">
        <div>
          <div className="banner-label">Stay in the loop</div>
          <h2 className="banner-title">The <em>Inner Circle.</em></h2>
          <p>Early access, private sales & personal styling — all for free.</p>
        </div>
        <div className="newsletter-form">
          <input className="form-input" type="email" placeholder="Your email address" />
          <button className="btn btn-accent">Subscribe</button>
        </div>
      </section>
    </div>
  );
}