const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { authenticate, authorize } = require('../middleware/auth');
const {
  getProducts, getProduct, getFeaturedProducts,
  getProductsByCategory, getModels,
  createProduct, updateProduct, deleteProduct
} = require('../controllers/productController');

router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/models', getModels);
router.get('/category/:category', getProductsByCategory);
router.get('/:id', getProduct);

router.post('/', authenticate, authorize('admin'), [
  body('name').notEmpty().withMessage('Name is required'),
  body('model').notEmpty().withMessage('Model is required'),
  body('price').isNumeric().withMessage('Price must be a number'),
], validate, createProduct);

router.put('/:id', authenticate, authorize('admin'), updateProduct);
router.delete('/:id', authenticate, authorize('admin'), deleteProduct);

module.exports = router;
