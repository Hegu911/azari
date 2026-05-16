const express = require('express');
const router = express.Router();
const { createOrder, getUserOrders, getOrderById } = require('../controllers/orderController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getUserOrders);
router.post('/create', protect, createOrder);
router.get('/:id', protect, getOrderById);

module.exports = router;
