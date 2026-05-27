import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import './ProductCard.css';

const PALETTE = ['#c8bfb0','#2c2825','#b8c4c0','#d4c4b8','#e8e0d0','#3a2e28','#b8a890','#c8d0c8'];

export default function ProductCard({ product }) {
  const { add } = useCart();
  const { add: addWish, remove: removeWish, isInWishlist } = useWishlist();
  const { user } = useAuth();
  const inWishlist = isInWishlist(product._id);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!user) { toast.info('Please login to add items to cart'); return; }
    await add(product._id, 1, product.sizes?.[0], product.colors?.[0]);
    toast.success('Added to cart!');
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    if (!user) { toast.info('Please login to save items'); return; }
    if (inWishlist) await removeWish(product._id);
    else await addWish(product._id);
  };

  const colorIdx = product._id ? product._id.charCodeAt(product._id.length - 1) % PALETTE.length : 0;
  const bgColor = PALETTE[colorIdx];

  return (
    <Link to={`/products/${product._id}`} className="product-card">
      <div className="pc-img" style={{ background: `linear-gradient(160deg, ${bgColor}dd, ${bgColor}88)` }}>
        {product.images?.[0] && (
          <img
            src={product.images[0]}
            alt={product.name}
            style={{ width:'100%', height:'100%', objectFit:'cover', position:'absolute', inset:0 }}
          />
        )}
        {product.isNew && <span className="badge badge-new pc-badge">New</span>}
        {product.originalPrice && <span className="badge badge-sale pc-badge">Sale</span>}
        <button className="pc-wish" onClick={handleWishlist} title="Wishlist">
          {inWishlist ? '❤️' : '🤍'}
        </button>
        <div className="pc-overlay">
          <button className="btn btn-dark btn-sm" onClick={handleAdd}>Add to Cart</button>
        </div>
      </div>
      <div className="pc-info">
        <div className="pc-brand">{product.brand}</div>
        <div className="pc-name">{product.name}</div>
        <div className="pc-price">
          {product.originalPrice && (
            <span className="pc-original">₹{product.originalPrice.toLocaleString()}</span>
          )}
          ₹{product.price.toLocaleString()}
        </div>
      </div>
    </Link>
  );
}