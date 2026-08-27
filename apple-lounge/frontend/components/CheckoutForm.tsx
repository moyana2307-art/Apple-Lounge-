'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Truck, Store } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { createOrder } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';

interface FormState {
  name: string;
  phone: string;
  email: string;
  delivery_method: 'pickup' | 'delivery';
  delivery_address: string;
  order_notes: string;
}

export default function CheckoutForm() {
  const { items, subtotal, clearCart } = useCart();
  const [form, setForm] = useState<FormState>({
    name: '',
    phone: '',
    email: '',
    delivery_method: 'pickup',
    delivery_address: '',
    order_notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState<{ orderId: number } | null>(null);

  const updateField = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.name.trim() || !form.phone.trim()) {
      setError('Name and phone number are required.');
      return;
    }

    if (form.delivery_method === 'delivery' && !form.delivery_address.trim()) {
      setError('Delivery address is required for delivery orders.');
      return;
    }

    if (items.length === 0) {
      setError('Your cart is empty.');
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        customer_name: form.name,
        customer_phone: form.phone,
        customer_email: form.email || undefined,
        delivery_method: form.delivery_method,
        delivery_address: form.delivery_address || undefined,
        order_notes: form.order_notes || undefined,
        items: items.map((item) => ({
          product_id: item.product.id,
          quantity: item.quantity,
          color: item.color,
        })),
      };

      const res = await createOrder(orderData);
      clearCart();
      setSuccess({ orderId: res.data.id });
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : 'Failed to place order. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="text-center py-20"
      >
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-5" strokeWidth={1.5} />
        <h2 className="text-2xl font-semibold text-apple-dark mb-2">
          Order Placed!
        </h2>
        <p className="text-[#86868B] mb-1">
          Your order #{success.orderId} has been placed successfully.
        </p>
        <p className="text-sm text-[#86868B] mb-8">
          We will contact you shortly to confirm your order details.
        </p>
        <Link
          href="/"
          className="inline-block bg-apple-blue text-white px-8 py-3 rounded-full text-sm font-medium hover:bg-apple-blue-hover transition-colors duration-200"
        >
          Back to Home
        </Link>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="bg-red-50 text-red-600 text-sm px-5 py-3.5 rounded-2xl border border-red-100">
          {error}
        </div>
      )}

      <div>
        <h3 className="text-xs font-semibold text-[#86868B] uppercase tracking-widest mb-5">
          Personal Information
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-apple-dark mb-2">
              Full Name *
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => updateField('name', e.target.value)}
              required
              placeholder="John Doe"
              className="w-full px-4 py-3 bg-neutral-100 rounded-2xl text-sm text-apple-dark placeholder:text-neutral-400 outline-none focus:ring-2 focus:ring-apple-blue focus:ring-offset-0 transition-all duration-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-apple-dark mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => updateField('phone', e.target.value)}
              required
              placeholder="+263 77 123 4567"
              className="w-full px-4 py-3 bg-neutral-100 rounded-2xl text-sm text-apple-dark placeholder:text-neutral-400 outline-none focus:ring-2 focus:ring-apple-blue focus:ring-offset-0 transition-all duration-200"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-apple-dark mb-2">
          Email
        </label>
        <input
          type="email"
          value={form.email}
          onChange={(e) => updateField('email', e.target.value)}
          placeholder="john@example.com"
          className="w-full px-4 py-3 bg-neutral-100 rounded-2xl text-sm text-apple-dark placeholder:text-neutral-400 outline-none focus:ring-2 focus:ring-apple-blue focus:ring-offset-0 transition-all duration-200"
        />
      </div>

      <div className="pt-2">
        <h3 className="text-xs font-semibold text-[#86868B] uppercase tracking-widest mb-5">
          Delivery Method
        </h3>
        <div className="inline-flex bg-neutral-100 rounded-full p-1 gap-1">
          <button
            type="button"
            onClick={() => updateField('delivery_method', 'pickup')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
              form.delivery_method === 'pickup'
                ? 'bg-white text-apple-dark shadow-sm'
                : 'text-[#86868B] hover:text-apple-dark'
            }`}
          >
            <Store className="w-4 h-4" />
            Pickup
          </button>
          <button
            type="button"
            onClick={() => updateField('delivery_method', 'delivery')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
              form.delivery_method === 'delivery'
                ? 'bg-white text-apple-dark shadow-sm'
                : 'text-[#86868B] hover:text-apple-dark'
            }`}
          >
            <Truck className="w-4 h-4" />
            Delivery
          </button>
        </div>
      </div>

      <AnimatePresence>
        {form.delivery_method === 'delivery' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <label className="block text-sm font-medium text-apple-dark mb-2">
              Delivery Address *
            </label>
            <textarea
              value={form.delivery_address}
              onChange={(e) => updateField('delivery_address', e.target.value)}
              required
              rows={3}
              placeholder="Enter your full delivery address..."
              className="w-full px-4 py-3 bg-neutral-100 rounded-2xl text-sm text-apple-dark placeholder:text-neutral-400 outline-none focus:ring-2 focus:ring-apple-blue focus:ring-offset-0 transition-all duration-200 resize-none"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div>
        <label className="block text-sm font-medium text-apple-dark mb-2">
          Order Notes
        </label>
        <textarea
          value={form.order_notes}
          onChange={(e) => updateField('order_notes', e.target.value)}
          rows={2}
          placeholder="Special requests, color preferences..."
          className="w-full px-4 py-3 bg-neutral-100 rounded-2xl text-sm text-apple-dark placeholder:text-neutral-400 outline-none focus:ring-2 focus:ring-apple-blue focus:ring-offset-0 transition-all duration-200 resize-none"
        />
      </div>

      <div className="bg-neutral-50 rounded-2xl p-5 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-[#86868B]">
            Subtotal ({items.length} item{items.length !== 1 ? 's' : ''})
          </span>
          <span className="font-medium text-apple-dark">
            {formatPrice(subtotal)}
          </span>
        </div>
        {form.delivery_method === 'delivery' && (
          <div className="flex justify-between text-sm">
            <span className="text-[#86868B]">Delivery</span>
            <span className="text-[#86868B]">Calculated at confirmation</span>
          </div>
        )}
        <div className="border-t border-neutral-200 pt-3 flex justify-between">
          <span className="font-semibold text-apple-dark">Total</span>
          <span className="font-bold text-apple-dark text-lg">
            {formatPrice(subtotal)}
          </span>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || items.length === 0}
        className="w-full bg-apple-blue text-white py-4 rounded-full text-sm font-medium hover:bg-apple-blue-hover transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {loading ? 'Placing Order...' : 'Place Order'}
      </button>
    </form>
  );
}
