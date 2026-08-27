const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { authenticate, authorize } = require('../middleware/auth');
const { createOrder, getOrders, getOrder, updateOrderStatus } = require('../controllers/orderController');

router.post('/', [
  body('customer_name').notEmpty().withMessage('Name is required'),
  body('customer_phone').notEmpty().withMessage('Phone is required'),
  body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
], validate, createOrder);

router.get('/', authenticate, authorize('admin'), getOrders);
router.get('/:id', authenticate, getOrder);
router.put('/:id/status', authenticate, authorize('admin'), updateOrderStatus);

module.exports = router;
