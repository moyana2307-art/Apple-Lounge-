const generateWhatsAppUrl = (phone, message) => {
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${phone}?text=${encodedMessage}`;
};

const formatPrice = (price) => {
  return `$${parseFloat(price).toFixed(2)}`;
};

module.exports = { generateWhatsAppUrl, formatPrice };
