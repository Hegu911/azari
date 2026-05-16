const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { adminProtect, requireAdmin } = require('../middleware/adminAuth');
const c = require('../controllers/adminController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../../uploads')),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${Math.random().toString(36).substring(2)}${path.extname(file.originalname)}`),
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// Auth
router.post('/login', c.adminLogin);
router.get('/me', adminProtect, requireAdmin, c.getAdminMe);

// Dashboard
router.get('/dashboard', adminProtect, requireAdmin, c.getDashboard);

// Products
router.get('/products', adminProtect, requireAdmin, c.getAdminProducts);
router.post('/products', adminProtect, requireAdmin, upload.single('image'), c.createProduct);
router.put('/products/:id', adminProtect, requireAdmin, upload.single('image'), c.updateProduct);
router.delete('/products/:id', adminProtect, requireAdmin, c.deleteProduct);

// Orders
router.get('/orders', adminProtect, requireAdmin, c.getAdminOrders);
router.get('/orders/:id', adminProtect, requireAdmin, c.getAdminOrderById);
router.put('/orders/:id/status', adminProtect, requireAdmin, c.updateOrderStatus);

// Users
router.get('/users', adminProtect, requireAdmin, c.getAdminUsers);
router.delete('/users/:id', adminProtect, requireAdmin, c.deleteUser);

// Categories
router.get('/categories', adminProtect, requireAdmin, c.getAdminCategories);
router.post('/categories', adminProtect, requireAdmin, upload.single('image'), c.createCategory);
router.put('/categories/:id', adminProtect, requireAdmin, upload.single('image'), c.updateCategory);
router.delete('/categories/:id', adminProtect, requireAdmin, c.deleteCategory);

// Brands
router.get('/brands', adminProtect, requireAdmin, c.getAdminBrands);
router.post('/brands', adminProtect, requireAdmin, upload.single('image'), c.createBrand);
router.put('/brands/:id', adminProtect, requireAdmin, upload.single('image'), c.updateBrand);
router.delete('/brands/:id', adminProtect, requireAdmin, c.deleteBrand);

// Coupons
router.get('/coupons', adminProtect, requireAdmin, c.getAdminCoupons);
router.post('/coupons', adminProtect, requireAdmin, c.createCoupon);
router.delete('/coupons/:id', adminProtect, requireAdmin, c.deleteCoupon);

// Reviews
router.get('/reviews', adminProtect, requireAdmin, c.getAdminReviews);
router.delete('/reviews/:id', adminProtect, requireAdmin, c.deleteReview);

module.exports = router;
