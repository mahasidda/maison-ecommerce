import { createContext, useContext, useState, useEffect } from 'react';
import { getWishlist, addToWishlist, removeFromWishlist } from '../services/api';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState({ products: [] });

  useEffect(() => {
    if (user) fetchWishlist();
    else setWishlist({ products: [] });
  }, [user]);

  const fetchWishlist = async () => {
    try {
      const { data } = await getWishlist();
      setWishlist(data);
    } catch {}
  };

  const add = async (productId) => {
    try {
      const { data } = await addToWishlist(productId);
      setWishlist(data);
      toast.success('Added to wishlist! ❤️');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Already in wishlist');
    }
  };

  const remove = async (productId) => {
    try {
      const { data } = await removeFromWishlist(productId);
      setWishlist(data);
      toast.success('Removed from wishlist');
    } catch {}
  };

  const isInWishlist = (productId) =>
    wishlist.products?.some((p) => p._id === productId || p === productId);

  return (
    <WishlistContext.Provider value={{ wishlist, add, remove, isInWishlist, fetchWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);