const bcrypt = require('bcryptjs');
const { prisma } = require('../config/database');
const generateToken = require('../utils/generateToken');
const { slugify } = require('../utils/helpers');

// ==================== AUTH ====================
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = generateToken(admin.id);
    res.json({ admin: { id: admin.id, name: admin.name, email: admin.email, role: admin.role }, token });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getAdminMe = async (req, res) => {
  try {
    const admin = await prisma.admin.findUnique({ where: { id: req.user.id }, select: { id: true, name: true, email: true, avatar: true, role: true } });
    res.json(admin);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ==================== DASHBOARD ====================
const getDashboard = async (req, res) => {
  try {
    const [totalUsers, totalProducts, totalOrders, totalRevenue, recentOrders, ordersByStatus] = await Promise.all([
      prisma.user.count(),
      prisma.product.count({ where: { isActive: true } }),
      prisma.order.count(),
      prisma.order.aggregate({ _sum: { total: true } }),
      prisma.order.findMany({ take: 5, orderBy: { createdAt: 'desc' }, include: { user: { select: { name: true, email: true } } } }),
      prisma.order.groupBy({ by: ['status'], _count: true }),
    ]);

    const monthlySales = await prisma.$queryRaw`
      SELECT DATE_FORMAT(created_at, '%Y-%m') as month, SUM(total) as revenue, COUNT(*) as orders
      FROM orders WHERE created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
      GROUP BY month ORDER BY month ASC
    `;

    res.json({
      stats: {
        totalUsers, totalProducts, totalOrders,
        totalRevenue: totalRevenue._sum.total || 0,
        pendingOrders: ordersByStatus.find(s => s.status === 'pending')?._count || 0,
      },
      recentOrders,
      ordersByStatus,
      monthlySales,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ==================== PRODUCTS ====================
const getAdminProducts = async (req, res) => {
  try {
    const { page = 1, search } = req.query;
    const skip = (parseInt(page) - 1) * 20;
    const where = search ? { name: { contains: search } } : {};
    const [products, total] = await Promise.all([
      prisma.product.findMany({ where, skip, take: 20, include: { category: true, brand: true }, orderBy: { createdAt: 'desc' } }),
      prisma.product.count({ where }),
    ]);
    res.json({ products: products.map(p => ({ ...p, price: parseFloat(p.price), comparePrice: p.comparePrice ? parseFloat(p.comparePrice) : null })), total, pages: Math.ceil(total / 20) });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const createProduct = async (req, res) => {
  try {
    if (!req.body || !req.body.name) {
      return res.status(400).json({ message: 'Məhsul adı tələb olunur' });
    }

    const data = { ...req.body, slug: slugify(req.body.name) };
    if (req.file) data.image = `/uploads/${req.file.filename}`;

    const category = await prisma.category.findUnique({ where: { id: parseInt(data.categoryId) } });
    if (!category) return res.status(400).json({ message: 'Kateqoriya tapılmadı' });

    const brand = await prisma.brand.findUnique({ where: { id: parseInt(data.brandId) } });
    if (!brand) return res.status(400).json({ message: 'Brand tapılmadı' });

    const product = await prisma.product.create({ data: {
      ...data,
      price: parseFloat(data.price) || 0,
      comparePrice: data.comparePrice !== undefined && data.comparePrice !== '' ? parseFloat(data.comparePrice) : null,
      costPrice: data.costPrice !== undefined && data.costPrice !== '' ? parseFloat(data.costPrice) : null,
      categoryId: parseInt(data.categoryId),
      brandId: parseInt(data.brandId),
      stock: parseInt(data.stock || 0),
      isFeatured: data.isFeatured === 'true' || data.isFeatured === true,
      isBestSeller: data.isBestSeller === 'true' || data.isBestSeller === true,
      isTrending: data.isTrending === 'true' || data.isTrending === true,
      isActive: data.isActive === 'true' || data.isActive === true || data.isActive === undefined,
      images: data.images || null,
    }, include: { category: true, brand: true } });

    res.status(201).json(product);
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

const updateProduct = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const data = { ...req.body };
    if (data.name) data.slug = slugify(data.name);
    if (req.file) data.image = `/uploads/${req.file.filename}`;
    if (data.price !== undefined) data.price = parseFloat(data.price);
    if (data.comparePrice !== undefined) data.comparePrice = data.comparePrice ? parseFloat(data.comparePrice) : null;
    if (data.costPrice !== undefined) data.costPrice = data.costPrice ? parseFloat(data.costPrice) : null;
    if (data.categoryId !== undefined) data.categoryId = parseInt(data.categoryId);
    if (data.brandId !== undefined) data.brandId = parseInt(data.brandId);
    if (data.stock !== undefined) data.stock = parseInt(data.stock);
    if (data.isFeatured !== undefined) data.isFeatured = data.isFeatured === 'true' || data.isFeatured === true;
    if (data.isBestSeller !== undefined) data.isBestSeller = data.isBestSeller === 'true' || data.isBestSeller === true;
    if (data.isTrending !== undefined) data.isTrending = data.isTrending === 'true' || data.isTrending === true;
    if (data.isActive !== undefined) data.isActive = data.isActive === 'true' || data.isActive === true;
    Object.keys(data).forEach(k => data[k] === '' && (data[k] = null));

    const product = await prisma.product.update({ where: { id }, data, include: { category: true, brand: true } });
    res.json(product);
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.cartItem.deleteMany({ where: { productId: id } });
    await prisma.wishlist.deleteMany({ where: { productId: id } });
    await prisma.review.deleteMany({ where: { productId: id } });
    await prisma.orderItem.deleteMany({ where: { productId: id } });
    await prisma.product.delete({ where: { id } });
    res.json({ message: 'Product deleted' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// ==================== ORDERS ====================
const getAdminOrders = async (req, res) => {
  try {
    const { page = 1, status } = req.query;
    const where = status && status !== 'all' ? { status } : {};
    const skip = (parseInt(page) - 1) * 20;
    const [orders, total] = await Promise.all([
      prisma.order.findMany({ where, skip, take: 20, include: { user: { select: { id: true, name: true, email: true } }, items: { include: { product: { select: { name: true, image: true } } } } }, orderBy: { createdAt: 'desc' } }),
      prisma.order.count({ where }),
    ]);
    res.json({ orders, total, pages: Math.ceil(total / 20) });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getAdminOrderById = async (req, res) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        user: { select: { id: true, name: true, email: true, phone: true } },
        items: {
          include: { product: { select: { id: true, name: true, image: true, slug: true } } },
        },
      },
    });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json({ ...order, total: parseFloat(order.total) });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status, paymentStatus, notes } = req.body;
    const order = await prisma.order.update({ where: { id: parseInt(req.params.id) }, data: { status, paymentStatus, notes } });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ==================== USERS ====================
const getAdminUsers = async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const skip = (parseInt(page) - 1) * 20;
    const [users, total] = await Promise.all([
      prisma.user.findMany({ skip, take: 20, orderBy: { createdAt: 'desc' }, select: { id: true, name: true, email: true, phone: true, role: true, createdAt: true, _count: { select: { orders: true } } } }),
      prisma.user.count(),
    ]);
    res.json({ users, total, pages: Math.ceil(total / 20) });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteUser = async (req, res) => {
  try {
    await prisma.user.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ==================== CATEGORIES ====================
const getAdminCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({ include: { _count: { select: { products: true } } }, orderBy: { name: 'asc' } });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const createCategory = async (req, res) => {
  try {
    const data = { name: req.body.name, slug: slugify(req.body.name), description: req.body.description };
    if (req.file) data.image = `/uploads/${req.file.filename}`;
    const category = await prisma.category.create({ data });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateCategory = async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.name) data.slug = slugify(data.name);
    if (req.file) data.image = `/uploads/${req.file.filename}`;
    const category = await prisma.category.update({ where: { id: parseInt(req.params.id) }, data });
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteCategory = async (req, res) => {
  try {
    await prisma.category.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ==================== BRANDS ====================
const getAdminBrands = async (req, res) => {
  try {
    const brands = await prisma.brand.findMany({ include: { _count: { select: { products: true } } }, orderBy: { name: 'asc' } });
    res.json(brands);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const createBrand = async (req, res) => {
  try {
    const data = { name: req.body.name, slug: slugify(req.body.name), description: req.body.description };
    if (req.file) data.logo = `/uploads/${req.file.filename}`;
    const brand = await prisma.brand.create({ data });
    res.status(201).json(brand);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateBrand = async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.name) data.slug = slugify(data.name);
    if (req.file) data.logo = `/uploads/${req.file.filename}`;
    const brand = await prisma.brand.update({ where: { id: parseInt(req.params.id) }, data });
    res.json(brand);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteBrand = async (req, res) => {
  try {
    await prisma.brand.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Brand deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ==================== COUPONS ====================
const getAdminCoupons = async (req, res) => {
  try {
    const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(coupons.map(c => ({ ...c, discountValue: parseFloat(c.discountValue), minOrderAmount: c.minOrderAmount ? parseFloat(c.minOrderAmount) : null })));
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const createCoupon = async (req, res) => {
  try {
    const coupon = await prisma.coupon.create({ data: { ...req.body, discountValue: parseFloat(req.body.discountValue), minOrderAmount: req.body.minOrderAmount ? parseFloat(req.body.minOrderAmount) : null, maxUses: req.body.maxUses ? parseInt(req.body.maxUses) : null } });
    res.status(201).json(coupon);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteCoupon = async (req, res) => {
  try {
    await prisma.coupon.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Coupon deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ==================== REVIEWS ====================
const getAdminReviews = async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({ include: { user: { select: { name: true, email: true } }, product: { select: { name: true } } }, orderBy: { createdAt: 'desc' } });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteReview = async (req, res) => {
  try {
    await prisma.review.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  adminLogin, getAdminMe, getDashboard,
  getAdminProducts, createProduct, updateProduct, deleteProduct,
  getAdminOrders, getAdminOrderById, updateOrderStatus,
  getAdminUsers, deleteUser,
  getAdminCategories, createCategory, updateCategory, deleteCategory,
  getAdminBrands, createBrand, updateBrand, deleteBrand,
  getAdminCoupons, createCoupon, deleteCoupon,
  getAdminReviews, deleteReview,
};
