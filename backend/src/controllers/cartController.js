const { prisma } = require('../config/database');

const getCart = async (req, res) => {
  try {
    let cart = await prisma.cart.findUnique({
      where: { userId: req.user.id },
      include: {
        items: {
          include: {
            product: {
              include: { category: true, brand: true },
            },
          },
        },
      },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: req.user.id },
        include: { items: true },
      });
    }

    const formattedItems = cart.items.map((item) => ({
      ...item,
      product: {
        ...item.product,
        price: parseFloat(item.product.price),
        comparePrice: item.product.comparePrice ? parseFloat(item.product.comparePrice) : null,
        rating: parseFloat(item.product.rating),
        images: item.product.images ? JSON.parse(item.product.images) : [],
      },
    }));

    const subtotal = formattedItems.reduce((sum, item) => sum + parseFloat(item.product.price) * item.quantity, 0);

    res.json({ ...cart, items: formattedItems, subtotal: parseFloat(subtotal.toFixed(2)) });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let cart = await prisma.cart.findUnique({ where: { userId: req.user.id } });
    if (!cart) {
      cart = await prisma.cart.create({ data: { userId: req.user.id } });
    }

    const existingItem = await prisma.cartItem.findUnique({
      where: { cartId_productId: { cartId: cart.id, productId } },
    });

    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
    } else {
      await prisma.cartItem.create({
        data: { cartId: cart.id, productId, quantity },
      });
    }

    const updatedCart = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: {
        items: {
          include: {
            product: { include: { category: true, brand: true } },
          },
        },
      },
    });

    const formattedItems = updatedCart.items.map((item) => ({
      ...item,
      product: {
        ...item.product,
        price: parseFloat(item.product.price),
        comparePrice: item.product.comparePrice ? parseFloat(item.product.comparePrice) : null,
        rating: parseFloat(item.product.rating),
        images: item.product.images ? JSON.parse(item.product.images) : [],
      },
    }));

    res.json({ ...updatedCart, items: formattedItems });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const itemId = parseInt(req.params.itemId);

    if (quantity < 1) {
      return res.status(400).json({ message: 'Quantity must be at least 1' });
    }

    const item = await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
      include: {
        product: { include: { category: true, brand: true } },
      },
    });

    res.json(item);
  } catch (error) {
    console.error('Update cart item error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const itemId = parseInt(req.params.itemId);
    await prisma.cartItem.delete({ where: { id: itemId } });
    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const clearCart = async (req, res) => {
  try {
    const cart = await prisma.cart.findUnique({ where: { userId: req.user.id } });
    if (cart) {
      await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    }
    res.json({ message: 'Cart cleared' });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
