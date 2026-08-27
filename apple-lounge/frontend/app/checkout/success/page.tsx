'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle, ShoppingBag, MessageCircle } from 'lucide-react';
import { generateWhatsAppUrl } from '@/lib/utils';

const whatsappPhone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '263771234567';

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  const whatsAppUrl = generateWhatsAppUrl(
    whatsappPhone,
    `Hello Apple Lounge!\n\nI just placed order #${orderId || ''}. I'd like to confirm the details and arrange payment/delivery.\n\nThank you!`
  );

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6 py-24">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="text-center max-w-lg"
      >
        {/* Animated Checkmark */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
          className="w-28 h-28 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-10"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <CheckCircle className="w-16 h-16 text-green-500" strokeWidth={1.5} />
          </motion.div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-4xl sm:text-5xl md:text-6xl font-bold text-apple-dark tracking-tight mb-5"
        >
          Order Placed!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.6 }}
          className="text-lg text-apple-gray mb-8 max-w-md mx-auto leading-relaxed"
        >
          Thank you for your order. We&apos;ll get in touch with you shortly to confirm the details.
        </motion.p>

        {orderId && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.6 }}
            className="bg-apple-light rounded-3xl p-6 mb-10 inline-block"
          >
            <p className="text-sm text-apple-gray mb-1">Order ID</p>
            <p className="text-2xl font-bold text-apple-dark">#{orderId}</p>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2.5 bg-apple-blue text-white px-10 py-4 rounded-full text-sm font-semibold hover:bg-apple-blue-hover transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
            Continue Shopping
          </Link>
          <a
            href={whatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2.5 bg-green-500 text-white px-10 py-4 rounded-full text-sm font-semibold hover:bg-green-600 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            Track via WhatsApp
          </a>
        </motion.div>
      </motion.div>
    </div>
  );
}
