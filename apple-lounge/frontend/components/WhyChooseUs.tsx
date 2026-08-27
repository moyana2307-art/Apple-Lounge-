'use client';

import { motion } from 'framer-motion';
import { Shield, Star, MapPin, Smartphone } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Brand New Devices',
    description: 'Every iPhone is brand new, sealed, and comes with full manufacturer warranty.',
  },
  {
    icon: Star,
    title: 'Trusted Service',
    description: 'Built on years of honest, reliable, and premium customer service in Zimbabwe.',
  },
  {
    icon: MapPin,
    title: 'Victoria Falls Location',
    description: 'Walk in, explore our range, and walk out with your new iPhone today.',
  },
  {
    icon: Smartphone,
    title: 'Easy Ordering',
    description: 'Order via WhatsApp, our website, or visit us in-store. Same-day pickup available.',
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-24 md:py-32 bg-[#1d1d1f]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-14 md:mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight">
            Why Apple Lounge
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 max-w-4xl mx-auto">
          {features.map(({ icon: Icon, title, description }, index) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="flex gap-5"
            >
              <div className="shrink-0 w-12 h-12 bg-white/[0.07] rounded-xl flex items-center justify-center">
                <Icon className="w-5 h-5 text-white/70" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-[17px] font-semibold text-white mb-1">{title}</h3>
                <p className="text-[#86868B] leading-relaxed text-[14px]">{description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
