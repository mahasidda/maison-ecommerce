import { createContext, useContext, useState, useEffect } from 'react';
import { getCart, addToCart, updateCartItem, removeFromCart } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) fetchCart();
    else setCart({ items: [] });
  }, [user]);

  const fetchCart = async () => {
    try {
      const { data } = await getCart();
      setCart(data);
    } catch (err) {
      console.error('Cart fetch error:', err);
    }
  };

  const add = async (productId, quantity = 1, size, color) => {
    setLoading(true);
    try {
      const { data } = await addToCart({ productId, quantity, size, color });
      setCart(data);
      await fetchCart();
    } catch (err) {
      console.error('Add to cart error:', err);
    } finally { setLoading(false); }
  };

  const update = async (itemId, quantity) => {
    try {
      const { data } = await updateCartItem(itemId, { quantity });
      setCart(data);
      await fetchCart();
    } catch (err) {
      console.error('Update cart error:', err);
    }
  };

  const remove = async (itemId) => {
    try {
      const { data } = await removeFromCart(itemId);
      setCart(data);
      await fetchCart();
    } catch (err) {
      console.error('Remove cart error:', err);
    }
  };

  const total = cart.items.reduce(
    (sum, i) => sum + (i.product?.price || 0) * i.quantity, 0
  );
  const count = cart.items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, add, update, remove, total, count, loading, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);