'use client';

import { motion } from 'framer-motion';
import { Shield, Truck, Headphones, Zap, MapPin, MessageCircle } from 'lucide-react';
import { generateWhatsAppUrl } from '@/lib/utils';

const whatsappPhone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '263771234567';

const features = [
  {
    icon: Shield,
    title: 'Brand New Devices',
    description:
      'Every product is brand-new, sealed, and backed by the full Apple warranty. No refurbished, no counterfeit — only genuine.',
  },
  {
    icon: Headphones,
    title: 'Trusted Service',
    description:
      'Our Apple-certified advisors are passionate about technology and dedicated to helping you find the perfect device.',
  },
  {
    icon: MapPin,
    title: 'Victoria Falls',
    description:
      'Proudly based in Victoria Falls, Zimbabwe — serving as the gateway to the Apple ecosystem for customers nationwide.',
  },
  {
    icon: Zap,
    title: 'Easy Ordering',
    description:
      'Browse, choose, and order in minutes. Same-day local delivery and nationwide shipping with flexible payment options.',
  },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-apple-dark text-white pt-32 pb-24 md:pt-44 md:pb-32">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-apple-blue text-sm font-semibold tracking-[0.2em] uppercase mb-6"
          >
            About Apple Lounge
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl sm:text-6xl md:text-8xl font-bold tracking-tight leading-[1.05]"
          >
            About Apple
            <br />
            Lounge
          </motion.h1>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-28 md:py-40">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className="text-4xl sm:text-5xl md:text-7xl font-bold text-apple-dark tracking-tight leading-[1.1] mb-10">
              Empowering
              <br />
              Connections
            </h2>
            <div className="max-w-3xl space-y-6 text-lg md:text-xl text-apple-gray leading-relaxed">
              <p>
                Apple Lounge Zimbabwe was born from a simple belief: everyone in Zimbabwe deserves access to genuine, premium Apple products without compromise.
              </p>
              <p>
                Located in the beautiful city of Victoria Falls, we serve as the gateway to the Apple ecosystem for customers across the country. From the latest iPhones to MacBooks, iPads, and Apple Watches — we bring you the complete Apple experience.
              </p>
              <p>
                Our team is made up of passionate Apple enthusiasts who understand the technology inside and out. We don&apos;t just sell devices — we help you discover how they can transform your daily life.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-28 md:py-40 bg-apple-light">
        <div className="max-w-6xl mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-apple-dark text-center tracking-tight mb-20"
          >
            Why Choose Us
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, title, description }, i) => (
              <motion.div
                key={title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
                variants={fadeInUp}
                className="bg-white rounded-3xl p-8 text-center hover:shadow-lg transition-shadow duration-300"
              >
                <div className="w-16 h-16 bg-apple-light rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Icon className="w-7 h-7 text-apple-blue" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-semibold text-apple-dark mb-3">{title}</h3>
                <p className="text-sm text-apple-gray leading-relaxed">{description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Large Image Section */}
      <section className="py-28 md:py-40">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-3xl overflow-hidden"
          >
            <img
              src="/Pics/IPhone 17.jpg"
              alt="Apple Lounge Store"
              className="w-full h-[400px] sm:h-[500px] md:h-[600px] object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* Dark Brand Statement */}
      <section className="py-28 md:py-40 bg-apple-dark text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-xs font-semibold tracking-[0.25em] uppercase text-apple-blue mb-8">
              Our Mission
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-[1.15] mb-8">
              To empower every Zimbabwean with access to genuine Apple technology, backed by exceptional customer service and competitive pricing.
            </h2>
            <div className="flex items-center justify-center gap-3 text-apple-gray text-lg">
              <MapPin className="w-5 h-5 text-apple-blue" />
              <span>Victoria Falls, Zimbabwe</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* WhatsApp CTA */}
      <section className="py-28 md:py-32">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-apple-dark tracking-tight mb-6">
              Get in Touch
            </h2>
            <p className="text-lg text-apple-gray mb-10 max-w-xl mx-auto">
              Have questions? We&apos;d love to hear from you. Chat with us on WhatsApp for instant support.
            </p>
            <a
              href={generateWhatsAppUrl(
                whatsappPhone,
                "Hello Apple Lounge! I'd like to learn more about your products and services."
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-green-500 text-white px-10 py-5 rounded-full text-lg font-semibold hover:bg-green-600 transition-colors duration-300"
            >
              <MessageCircle className="w-5 h-5" />
              Chat on WhatsApp
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
