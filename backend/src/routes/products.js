const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getProductBySlug,
  getProductById,
  getFeaturedProducts,
  getBestSellers,
  getTrendingProducts,
} = require('../controllers/productController');

router.get('/', getAllProducts);
router.get('/featured', getFeaturedProducts);
router.get('/best-sellers', getBestSellers);
router.get('/trending', getTrendingProducts);
router.get('/id/:id', getProductById);
router.get('/:slug', getProductBySlug);

module.exports = router;
