const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

const formatPrice = (price) => {
  return parseFloat(price).toFixed(2);
};

const calculateTotal = (items) => {
  return items.reduce((total, item) => {
    return total + parseFloat(item.price) * item.quantity;
  }, 0);
};

module.exports = { slugify, formatPrice, calculateTotal };
