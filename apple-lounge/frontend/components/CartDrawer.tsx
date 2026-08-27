'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { formatPrice, getImageUrl } from '@/lib/utils';

export default function CartDrawer() {
  const {
    items,
    isOpen,
    setIsOpen,
    removeFromCart,
    updateQuantity,
    subtotal,
    totalItems,
  } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[80]"
            onClick={() => setIsOpen(false)}
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed inset-y-0 right-0 w-full max-w-md bg-white z-[90] shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100">
              <div>
                <h2 className="text-lg font-semibold text-apple-dark">
                  Your Cart
                </h2>
                {totalItems > 0 && (
                  <p className="text-sm text-[#86868B] mt-0.5">
                    {totalItems} item{totalItems !== 1 ? 's' : ''}
                  </p>
                )}
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 -mr-2 rounded-full hover:bg-neutral-100 transition-colors duration-150"
              >
                <X className="w-5 h-5 text-apple-dark" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full px-6 text-center">
                  <ShoppingBag className="w-14 h-14 text-neutral-200 mb-5" strokeWidth={1.5} />
                  <p className="text-base font-medium text-apple-dark mb-1">
                    Your cart is empty
                  </p>
                  <p className="text-sm text-[#86868B] mb-6">
                    Find something you love.
                  </p>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="bg-apple-blue text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-apple-blue-hover transition-colors duration-200"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                <div className="p-6 space-y-3">
                  {items.map((item) => (
                    <motion.div
                      key={`${item.product.id}-${item.color}`}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 40 }}
                      transition={{ duration: 0.2 }}
                      className="flex gap-4 p-4 rounded-2xl bg-neutral-50"
                    >
                      <div className="w-18 h-18 bg-white rounded-xl flex items-center justify-center shrink-0 overflow-hidden">
                        <img
                          src={getImageUrl(item.product.image)}
                          alt={item.product.name}
                          className="w-full h-full object-contain p-1.5"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-apple-dark truncate">
                          {item.product.name}
                        </h3>
                        <p className="text-xs text-[#86868B] mt-0.5">
                          {item.product.storage}
                          {item.color && ` · ${item.color}`}
                        </p>
                        <p className="text-sm font-semibold text-apple-dark mt-2">
                          {formatPrice(item.product.price)}
                        </p>
                      </div>

                      <div className="flex flex-col items-end justify-between">
                        <button
                          onClick={() =>
                            removeFromCart(item.product.id, item.color)
                          }
                          className="p-1 text-neutral-400 hover:text-red-500 transition-colors duration-150"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        <div className="flex items-center gap-1.5 bg-white rounded-full border border-neutral-200 px-1">
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.product.id,
                                item.quantity - 1,
                                item.color
                              )
                            }
                            className="p-1.5 rounded-full hover:bg-neutral-100 transition-colors duration-150"
                          >
                            <Minus className="w-3 h-3 text-apple-dark" />
                          </button>
                          <span className="text-sm font-medium text-apple-dark w-5 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.product.id,
                                item.quantity + 1,
                                item.color
                              )
                            }
                            className="p-1.5 rounded-full hover:bg-neutral-100 transition-colors duration-150"
                          >
                            <Plus className="w-3 h-3 text-apple-dark" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="px-6 py-5 border-t border-neutral-100 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#86868B]">Subtotal</span>
                  <span className="text-lg font-semibold text-apple-dark">
                    {formatPrice(subtotal)}
                  </span>
                </div>

                <Link
                  href="/checkout"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center bg-apple-blue text-white py-3.5 rounded-full text-sm font-medium hover:bg-apple-blue-hover transition-colors duration-200"
                >
                  Checkout
                </Link>

                <button
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center text-sm text-apple-blue hover:text-apple-blue-hover font-medium py-1 transition-colors duration-200"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
