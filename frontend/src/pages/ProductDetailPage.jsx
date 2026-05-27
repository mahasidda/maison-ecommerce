import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProduct } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import Reviews from '../components/product/Reviews';
import './ProductDetailPage.css';

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [qty, setQty] = useState(1);
  const { add, loading } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    getProduct(id).then(({ data }) => {
      setProduct(data);
      setSelectedSize(data.sizes?.[0] || '');
    });
  }, [id]);

  const handleAdd = async () => {
    if (!user) { toast.info('Please login first'); return; }
    await add(product._id, qty, selectedSize, product.colors?.[0]);
    toast.success('Added to cart!');
  };

  if (!product) return <div className="page-loader"><div className="spinner" /></div>;

  return (
    <>
      <div className="detail-page">

        {/* Product Image */}
        <div className="detail-img-wrap">
          {product.images?.[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="detail-img-real"
            />
          ) : (
            <div className="detail-img-placeholder" />
          )}
          {product.isNew && (
            <span className="badge badge-new" style={{ position: 'absolute', top: '1.5rem', left: '1.5rem' }}>New</span>
          )}
          {product.originalPrice && (
            <span className="badge badge-sale" style={{ position: 'absolute', top: '1.5rem', left: product.isNew ? '5rem' : '1.5rem' }}>Sale</span>
          )}
        </div>

        {/* Product Info */}
        <div className="detail-info">
          <div className="detail-brand">{product.brand}</div>
          <h1 className="detail-name">{product.name}</h1>

          <div className="detail-price">
            {product.originalPrice && (
              <span className="detail-original">₹{product.originalPrice.toLocaleString()}</span>
            )}
            <span>₹{product.price.toLocaleString()}</span>
          </div>

          <p className="detail-desc">{product.description}</p>

          {/* Sizes */}
          {product.sizes?.length > 0 && (
            <div className="detail-section">
              <div className="detail-section-label">Size</div>
              <div className="size-group">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    className={`size-btn ${selectedSize === s ? 'active' : ''}`}
                    onClick={() => setSelectedSize(s)}
                  >{s}</button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="detail-section">
            <div className="detail-section-label">Quantity</div>
            <div className="qty-group">
              <button className="qty-btn" onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
              <span className="qty-val">{qty}</span>
              <button className="qty-btn" onClick={() => setQty(qty + 1)}>+</button>
            </div>
          </div>

          <button className="btn btn-accent btn-add" onClick={handleAdd} disabled={loading}>
            {loading ? 'Adding...' : 'Add to Cart'}
          </button>

          <div className="detail-meta">
            <div>Stock: <strong>{product.stock} left</strong></div>
            <div>Category: <strong>{product.category}</strong></div>
            <div>Rating: <strong>{'★'.repeat(Math.round(product.rating))}{'☆'.repeat(5 - Math.round(product.rating))} ({product.numReviews})</strong></div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <Reviews productId={id} />
    </>
  );
}