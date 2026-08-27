'use client';

import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { generateWhatsAppUrl } from '@/lib/utils';

export default function WhatsAppCTA() {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '263771234567';
  const message = 'Hello Apple Lounge! I would like to inquire about your products.';
  const url = generateWhatsAppUrl(phone, message);

  return (
    <section className="py-32 md:py-40 bg-[#1d1d1f] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(37,211,102,0.06) 0%, transparent 60%)' }}
        />
      </div>
      <div className="relative max-w-4xl mx-auto px-5 sm:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.05]">
            Let&apos;s find your
            <br />
            next iPhone.
          </h2>
          <p className="mt-5 text-lg text-[#86868B] max-w-lg mx-auto leading-relaxed">
            Talk to us on WhatsApp. Our experts will help you find the perfect iPhone.
          </p>

          <motion.a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2.5 bg-[#25D366] text-white px-10 py-4 rounded-full text-[15px] font-semibold hover:bg-[#20bd5a] transition-colors mt-10 shadow-[0_4px_24px_rgba(37,211,102,0.2)]"
          >
            <MessageCircle className="w-5 h-5" />
            Chat on WhatsApp
          </motion.a>

          <p className="text-[13px] text-[#86868B]/50 mt-6">
            +263 77 123 4567 &middot; Usually replies within minutes
          </p>
        </motion.div>
      </div>
    </section>
  );
}
