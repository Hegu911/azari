const { prisma } = require('../config/database');

const formatOrderItems = (items) => items.map((item) => ({
  ...item,
  price: parseFloat(item.price),
  product: item.product ? {
    ...item.product,
    price: parseFloat(item.product.price),
    comparePrice: item.product.comparePrice ? parseFloat(item.product.comparePrice) : null,
    rating: parseFloat(item.product.rating),
    images: item.product.images ? JSON.parse(item.product.images) : [],
  } : item.product,
}));

const generateOrderNumber = () => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `PF-${timestamp}-${random}`;
};

const createOrder = async (req, res) => {
  try {
    const { shippingAddress, paymentMethod } = req.body;

    const cart = await prisma.cart.findUnique({
      where: { userId: req.user.id },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const total = cart.items.reduce((sum, item) => {
      return sum + parseFloat(item.product.price) * item.quantity;
    }, 0);

    const orderNumber = generateOrderNumber();

    const order = await prisma.order.create({
      data: {
        userId: req.user.id,
        orderNumber,
        total: parseFloat(total.toFixed(2)),
        shippingAddress,
        paymentMethod,
        status: 'pending',
        items: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: parseFloat(item.product.price),
          })),
        },
      },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

    res.status(201).json({ ...order, total: parseFloat(order.total), items: formatOrderItems(order.items) });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      include: {
        items: {
          include: { product: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(orders.map((order) => ({ ...order, total: parseFloat(order.total), items: formatOrderItems(order.items) })));
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json({ ...order, total: parseFloat(order.total), items: formatOrderItems(order.items) });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createOrder, getUserOrders, getOrderById };
