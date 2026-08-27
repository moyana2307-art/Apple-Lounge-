'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, ChevronRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice, getImageUrl } from '@/lib/utils';

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, subtotal, totalItems } = useCart();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-apple-dark text-white pt-32 pb-20 md:pt-40 md:pb-24">
        <div className="max-w-6xl mx-auto px-6">
          <nav className="flex items-center gap-2 text-sm text-apple-gray mb-8">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white font-medium">Cart</span>
          </nav>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight"
          >
            Shopping Cart
          </motion.h1>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-6">
          {items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-center py-24"
            >
              <div className="w-28 h-28 bg-apple-light rounded-full flex items-center justify-center mx-auto mb-8">
                <ShoppingBag className="w-12 h-12 text-apple-gray" strokeWidth={1.5} />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-apple-dark mb-3">Your cart is empty</h2>
              <p className="text-lg text-apple-gray mb-10 max-w-md mx-auto">
                Add some products to get started with your Apple experience.
              </p>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 bg-apple-blue text-white px-10 py-4 rounded-full text-sm font-semibold hover:bg-apple-blue-hover transition-colors"
              >
                Continue Shopping
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                <AnimatePresence mode="popLayout">
                  {items.map(item => (
                    <motion.div
                      key={`${item.product.id}-${item.color}`}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -80, transition: { duration: 0.3 } }}
                      className="flex gap-5 bg-white border border-apple-border rounded-3xl p-5 hover:shadow-md transition-shadow duration-300"
                    >
                      <Link
                        href={`/products/${item.product.id}`}
                        className="w-28 h-28 sm:w-32 sm:h-32 bg-apple-light rounded-2xl flex-shrink-0 flex items-center justify-center p-3"
                      >
                        <img
                          src={getImageUrl(item.product.image)}
                          alt={item.product.name}
                          className="w-full h-full object-contain"
                        />
                      </Link>

                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div className="flex justify-between items-start gap-3">
                          <div className="min-w-0">
                            <Link
                              href={`/products/${item.product.id}`}
                              className="font-semibold text-apple-dark hover:text-apple-blue transition-colors line-clamp-1 text-base"
                            >
                              {item.product.name}
                            </Link>
                            <p className="text-sm text-apple-gray mt-0.5">{item.product.model}</p>
                            <p className="text-sm text-apple-gray">{item.product.storage}</p>
                            {item.color && (
                              <p className="text-sm text-apple-gray">Color: {item.color}</p>
                            )}
                          </div>
                          <button
                            onClick={() => removeFromCart(item.product.id, item.color)}
                            className="p-2.5 text-apple-gray hover:text-red-500 hover:bg-red-50 rounded-xl transition-all flex-shrink-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center gap-3 bg-apple-light rounded-full px-1 py-1">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.color)}
                              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-8 text-center font-semibold text-sm">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.color)}
                              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <span className="font-bold text-apple-dark text-lg">
                            {formatPrice(item.product.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 text-apple-blue hover:text-apple-blue-hover text-sm font-semibold mt-6"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Continue Shopping
                </Link>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-apple-light rounded-3xl p-8 sticky top-28">
                  <h2 className="text-lg font-semibold text-apple-dark mb-6">Order Summary</h2>
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-apple-gray">Items ({totalItems})</span>
                      <span className="text-apple-dark font-medium">{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-apple-gray">Shipping</span>
                      <span className="text-apple-gray">Calculated at checkout</span>
                    </div>
                    <div className="border-t border-apple-border pt-4">
                      <div className="flex justify-between">
                        <span className="font-semibold text-apple-dark">Subtotal</span>
                        <span className="font-bold text-apple-dark text-xl">{formatPrice(subtotal)}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => router.push('/checkout')}
                    className="w-full bg-apple-blue text-white py-4 rounded-full font-semibold text-sm hover:bg-apple-blue-hover transition-colors"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
