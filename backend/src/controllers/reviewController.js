const { prisma } = require('../config/database');

const getProductReviews = async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { productId: parseInt(req.params.productId) },
      include: {
        user: { select: { id: true, name: true, avatar: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(reviews);
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const createReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const existing = await prisma.review.findUnique({
      where: { userId_productId: { userId: req.user.id, productId } },
    });

    if (existing) {
      return res.status(400).json({ message: 'You already reviewed this product' });
    }

    const review = await prisma.review.create({
      data: { userId: req.user.id, productId, rating, comment },
      include: {
        user: { select: { id: true, name: true, avatar: true } },
      },
    });

    const reviews = await prisma.review.findMany({
      where: { productId },
      select: { rating: true },
    });

    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    await prisma.product.update({
      where: { id: productId },
      data: { rating: parseFloat(avgRating.toFixed(2)), reviewCount: reviews.length },
    });

    res.status(201).json(review);
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getProductReviews, createReview };
