const { prisma } = require('../config/database');
const { slugify } = require('../utils/helpers');

const getAllProducts = async (req, res) => {
  try {
    const {
      search,
      category,
      brand,
      minPrice,
      maxPrice,
      rating,
      sort,
      page = 1,
      limit = 12,
    } = req.query;

    const where = {};
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ];
    }

    if (category) {
      where.category = { slug: category };
    }

    if (brand) {
      where.brand = { slug: brand };
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    if (rating) {
      where.rating = { gte: parseFloat(rating) };
    }

    let orderBy = { createdAt: 'desc' };
    if (sort === 'price_asc') orderBy = { price: 'asc' };
    if (sort === 'price_desc') orderBy = { price: 'desc' };
    if (sort === 'rating') orderBy = { rating: 'desc' };
    if (sort === 'name') orderBy = { name: 'asc' };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { category: true, brand: true },
        orderBy,
        skip,
        take,
      }),
      prisma.product.count({ where }),
    ]);

    const formattedProducts = products.map((product) => ({
      ...product,
      price: parseFloat(product.price),
      comparePrice: product.comparePrice ? parseFloat(product.comparePrice) : null,
      rating: parseFloat(product.rating),
      images: product.images ? JSON.parse(product.images) : [],
    }));

    res.json({
      products: formattedProducts,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / take),
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getProductBySlug = async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { slug: req.params.slug },
      include: {
        category: true,
        brand: true,
        reviews: {
          include: { user: { select: { id: true, name: true, avatar: true } } },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const relatedProducts = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: product.id },
      },
      take: 4,
      include: { category: true, brand: true },
    });

    res.json({
      ...product,
      price: parseFloat(product.price),
      comparePrice: product.comparePrice ? parseFloat(product.comparePrice) : null,
      rating: parseFloat(product.rating),
      images: product.images ? JSON.parse(product.images) : [],
      relatedProducts: relatedProducts.map((p) => ({
        ...p,
        price: parseFloat(p.price),
        comparePrice: p.comparePrice ? parseFloat(p.comparePrice) : null,
        rating: parseFloat(p.rating),
        images: p.images ? JSON.parse(p.images) : [],
      })),
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getFeaturedProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: { isFeatured: true },
      take: 8,
      include: { category: true, brand: true },
      orderBy: { createdAt: 'desc' },
    });

    res.json(products.map((p) => ({
      ...p,
      price: parseFloat(p.price),
      comparePrice: p.comparePrice ? parseFloat(p.comparePrice) : null,
      rating: parseFloat(p.rating),
      images: p.images ? JSON.parse(p.images) : [],
    })));
  } catch (error) {
    console.error('Get featured error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { category: true, brand: true },
    });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ ...product, price: parseFloat(product.price), comparePrice: product.comparePrice ? parseFloat(product.comparePrice) : null, rating: parseFloat(product.rating), images: product.images ? JSON.parse(product.images) : [] });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getBestSellers = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: { isBestSeller: true },
      take: 8,
      include: { category: true, brand: true },
      orderBy: { rating: 'desc' },
    });

    res.json(products.map((p) => ({
      ...p,
      price: parseFloat(p.price),
      comparePrice: p.comparePrice ? parseFloat(p.comparePrice) : null,
      rating: parseFloat(p.rating),
      images: p.images ? JSON.parse(p.images) : [],
    })));
  } catch (error) {
    console.error('Get best sellers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getTrendingProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: { isTrending: true },
      take: 8,
      include: { category: true, brand: true },
      orderBy: { createdAt: 'desc' },
    });

    res.json(products.map((p) => ({
      ...p,
      price: parseFloat(p.price),
      comparePrice: p.comparePrice ? parseFloat(p.comparePrice) : null,
      rating: parseFloat(p.rating),
      images: p.images ? JSON.parse(p.images) : [],
    })));
  } catch (error) {
    console.error('Get trending error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getAllProducts, getProductBySlug, getProductById, getFeaturedProducts, getBestSellers, getTrendingProducts };
