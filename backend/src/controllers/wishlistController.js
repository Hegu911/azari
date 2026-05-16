const { prisma } = require('../config/database');

const getWishlist = async (req, res) => {
  try {
    const wishlist = await prisma.wishlist.findMany({
      where: { userId: req.user.id },
      include: {
        product: {
          include: { category: true, brand: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(wishlist.map((w) => ({
      ...w,
      product: {
        ...w.product,
        price: parseFloat(w.product.price),
        comparePrice: w.product.comparePrice ? parseFloat(w.product.comparePrice) : null,
        rating: parseFloat(w.product.rating),
        images: w.product.images ? JSON.parse(w.product.images) : [],
      },
    })));
  } catch (error) {
    console.error('Get wishlist error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const existing = await prisma.wishlist.findUnique({
      where: { userId_productId: { userId: req.user.id, productId } },
    });

    if (existing) {
      return res.status(400).json({ message: 'Product already in wishlist' });
    }

    const wishlistItem = await prisma.wishlist.create({
      data: { userId: req.user.id, productId },
      include: { product: true },
    });

    res.status(201).json(wishlistItem);
  } catch (error) {
    console.error('Add to wishlist error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const removeFromWishlist = async (req, res) => {
  try {
    const productId = parseInt(req.params.productId);
    await prisma.wishlist.delete({
      where: { userId_productId: { userId: req.user.id, productId } },
    });
    res.json({ message: 'Removed from wishlist' });
  } catch (error) {
    console.error('Remove from wishlist error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getWishlist, addToWishlist, removeFromWishlist };
