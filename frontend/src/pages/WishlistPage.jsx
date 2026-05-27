import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import './WishlistPage.css';

export default function WishlistPage() {
  const { wishlist, remove } = useWishlist();
  const { add } = useCart();

  const handleAddToCart = async (product) => {
    await add(product._id, 1, product.sizes?.[0], product.colors?.[0]);
    toast.success('Added to cart!');
  };

  if (wishlist.products?.length === 0)
    return (
      <div className="wishlist-empty">
        <div style={{ fontSize: 60 }}>❤️</div>
        <h2>Your wishlist is empty</h2>
        <p>Save your favourite products here!</p>
        <Link to="/products" className="btn btn-accent mt-3">Browse Products</Link>
      </div>
    );

  return (
    <div className="wishlist-page">
      <h1 className="wishlist-title">My Wishlist <span>({wishlist.products?.length})</span></h1>
      <div className="wishlist-grid">
        {wishlist.products?.map((product) => (
          <div className="wishlist-card" key={product._id}>
            <Link to={`/products/${product._id}`} className="wishlist-img-wrap">
              {product.images?.[0] ? (
                <img src={product.images[0]} alt={product.name} className="wishlist-img" />
              ) : (
                <div className="wishlist-img-placeholder" />
              )}
              {product.isNew && <span className="badge badge-new wishlist-badge">New</span>}
            </Link>
            <div className="wishlist-info">
              <div className="wishlist-brand">{product.brand}</div>
              <Link to={`/products/${product._id}`} className="wishlist-name">{product.name}</Link>
              <div className="wishlist-price">
                {product.originalPrice && (
                  <span className="wishlist-original">₹{product.originalPrice.toLocaleString()}</span>
                )}
                ₹{product.price.toLocaleString()}
              </div>
              <div className="wishlist-actions">
                <button
                  className="btn btn-accent btn-sm"
                  onClick={() => handleAddToCart(product)}
                >
                  Add to Cart
                </button>
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => remove(product._id)}
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}