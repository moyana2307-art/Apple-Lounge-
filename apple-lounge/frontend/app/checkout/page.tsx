'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice, getImageUrl } from '@/lib/utils';
import CheckoutForm from '@/components/CheckoutForm';

export default function CheckoutPage() {
  const { items, subtotal } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-apple-dark mb-3">Your cart is empty</h2>
          <p className="text-apple-gray mb-8">Add products before checking out.</p>
          <Link
            href="/products"
            className="inline-flex bg-apple-blue text-white px-10 py-4 rounded-full text-sm font-semibold hover:bg-apple-blue-hover transition-colors"
          >
            Shop Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-apple-light">
      {/* Header */}
      <section className="bg-apple-dark text-white pt-32 pb-20 md:pt-40 md:pb-24">
        <div className="max-w-6xl mx-auto px-6">
          <nav className="flex items-center gap-2 text-sm text-apple-gray mb-8">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/cart" className="hover:text-white transition-colors">Cart</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white font-medium">Checkout</span>
          </nav>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight"
          >
            Checkout
          </motion.h1>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="lg:col-span-2"
            >
              <div className="bg-white rounded-3xl p-8 md:p-10 border border-apple-border">
                <h2 className="text-2xl font-bold text-apple-dark tracking-tight mb-8">
                  Shipping Details
                </h2>
                <CheckoutForm />
              </div>
            </motion.div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="lg:col-span-1"
            >
              <div className="bg-white rounded-3xl p-8 border border-apple-border sticky top-28">
                <h2 className="text-lg font-semibold text-apple-dark mb-6">Order Summary</h2>
                <div className="space-y-4 mb-6 max-h-80 overflow-y-auto">
                  {items.map(item => (
                    <div key={`${item.product.id}-${item.color}`} className="flex gap-4">
                      <div className="w-16 h-16 bg-apple-light rounded-2xl flex-shrink-0 flex items-center justify-center p-2">
                        <img
                          src={getImageUrl(item.product.image)}
                          alt={item.product.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-apple-dark line-clamp-1">{item.product.name}</p>
                        <p className="text-xs text-apple-gray mt-0.5">{item.product.storage} · Qty: {item.quantity}</p>
                        <p className="text-sm font-bold text-apple-dark mt-1">{formatPrice(item.product.price * item.quantity)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-apple-border pt-5 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-apple-gray">Subtotal</span>
                    <span className="font-medium text-apple-dark">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-apple-gray">Shipping</span>
                    <span className="text-apple-gray">Calculated at confirmation</span>
                  </div>
                  <div className="border-t border-apple-border pt-3 flex justify-between">
                    <span className="font-semibold text-apple-dark">Total</span>
                    <span className="font-bold text-apple-dark text-xl">{formatPrice(subtotal)}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
