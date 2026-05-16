const express = require('express');
const router = express.Router();
const { getAllBrands, getBrandBySlug } = require('../controllers/brandController');

router.get('/', getAllBrands);
router.get('/:slug', getBrandBySlug);

module.exports = router;
