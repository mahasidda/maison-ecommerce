import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('maisonUser') || 'null');
  if (user?.token) config.headers.Authorization = `Bearer ${user.token}`;
  return config;
});

// Auth
export const loginUser = (data) => api.post('/auth/login', data);
export const registerUser = (data) => api.post('/auth/register', data);
export const getMe = () => api.get('/auth/me');

// Products
export const getProducts = (params) => api.get('/products', { params });
export const getProduct = (id) => api.get(`/products/${id}`);
export const createProduct = (data) => api.post('/products', data);
export const updateProduct = (id, data) => api.put(`/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/products/${id}`);

// Cart
export const getCart = () => api.get('/cart');
export const addToCart = (data) => api.post('/cart', data);
export const updateCartItem = (id, data) => api.put(`/cart/${id}`, data);
export const removeFromCart = (id) => api.delete(`/cart/${id}`);

// Orders
export const placeOrder = (data) => api.post('/orders', data);
export const getMyOrders = () => api.get('/orders/my');
export const getAllOrders = () => api.get('/orders');
export const updateOrderStatus = (id, status) => api.put(`/orders/${id}`, { status });

export const createRazorpayOrder = (data) => api.post('/payment/create-order', data);
export const verifyRazorpayPayment = (data) => api.post('/payment/verify', data);

export const getReviews = (id) => api.get(`/products/${id}/reviews`);
export const addReview = (id, data) => api.post(`/products/${id}/reviews`, data);
export const deleteReview = (id, reviewId) => api.delete(`/products/${id}/reviews/${reviewId}`);

export const getWishlist = () => api.get('/wishlist');
export const addToWishlist = (productId) => api.post('/wishlist', { productId });
export const removeFromWishlist = (productId) => api.delete(`/wishlist/${productId}`);

export const applyCoupon = (data) => api.post('/coupons/apply', data);
export const getAllCoupons = () => api.get('/coupons');
export const createCoupon = (data) => api.post('/coupons', data);
export const updateCoupon = (id, data) => api.put(`/coupons/${id}`, data);
export const deleteCoupon = (id) => api.delete(`/coupons/${id}`);
export default api;
