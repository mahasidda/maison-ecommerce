const express = require('express');
const router = express.Router();
const { placeOrder, getMyOrders, getAllOrders, updateOrderStatus } = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.use(protect);
router.post('/', placeOrder);
router.get('/my', getMyOrders);
router.get('/', adminOnly, getAllOrders);
router.put('/:id', adminOnly, updateOrderStatus);

module.exports = router;
