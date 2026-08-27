const nodemailer = require('nodemailer');

const recipient = process.env.EMAIL_TO || 'gotocarlos197@gmail.com';

function getTransporter() {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 465),
    secure: process.env.SMTP_SECURE !== 'false',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
}

async function sendOrderNotification(order, items) {
  const transporter = getTransporter();
  if (!transporter) {
    console.warn('Order email skipped: SMTP_HOST, SMTP_USER, and SMTP_PASSWORD are not configured');
    return false;
  }

  const itemLines = items
    .map((item) => `${item.name} x${item.quantity}${item.color ? ` (${item.color})` : ''} - $${Number(item.price * item.quantity).toLocaleString('en-US')}`)
    .join('\n');

  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: recipient,
    subject: `New Apple Lounge order #${order.id}`,
    text: [
      `A new order has been placed: #${order.id}`,
      '',
      `Customer: ${order.customer_name}`,
      `Phone: ${order.customer_phone}`,
      `Email: ${order.customer_email || 'Not provided'}`,
      `Delivery: ${order.delivery_method}`,
      `Address: ${order.delivery_address || 'Pickup'}`,
      '',
      'Items:',
      itemLines,
      '',
      `Total: $${Number(order.total_amount).toLocaleString('en-US')}`,
      `Notes: ${order.order_notes || 'None'}`,
    ].join('\n'),
  });

  return true;
}

module.exports = { sendOrderNotification };