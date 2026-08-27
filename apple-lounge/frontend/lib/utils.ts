import { type ClassValue, clsx } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatPrice(price: number): string {
  return `$${price.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

export function generateWhatsAppUrl(phone: string, message: string): string {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function generateWhatsAppMessage(productName: string, storage: string, price: number): string {
  return `Hello Apple Lounge,

I would like to order:

*${productName}*
${storage}
Price: $${price.toLocaleString()}

Name:
Phone:
Delivery/Pickup:

Thank you!`;
}

export function getImageUrl(path: string | null): string {
  if (!path) return '/placeholder-phone.svg';
  if (path.startsWith('http')) return path;
  return path;
}
