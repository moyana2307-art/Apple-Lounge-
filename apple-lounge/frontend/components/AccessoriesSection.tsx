'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const accessories = [
  {
    name: 'AirPods Pro 2',
    description: 'Adaptive Audio. Intelligent noise cancellation.',
    image: '/Pics/airpods pro2.jpg',
    price: 'From $249',
    category: 'Audio',
  },
  {
    name: 'AirPods Pro 4',
    description: 'The next generation of AirPods.',
    image: '/Pics/airpods pro4.webp',
    price: 'From $179',
    category: 'Audio',
  },
  {
    name: 'Apple Watch Series 10',
    description: 'Thinner. Brighter. Mightier.',
    image: '/Pics/apple watch series 10.jpg',
    price: 'From $399',
    category: 'Watches',
  },
  {
    name: 'Apple Watch Ultra 2',
    description: 'The most capable Apple Watch.',
    image: '/Pics/apple watch ultra 2.webp',
    price: 'From $799',
    category: 'Watches',
  },
  {
    name: 'USB-C Adapter',
    description: 'Essential connectivity, streamlined.',
    image: '/Pics/adapter.webp',
    price: 'From $29',
    category: 'Power',
  },
  {
    name: 'USB Cable',
    description: 'Fast charging, built to last.',
    image: '/Pics/usb cable.webp',
    price: 'From $19',
    category: 'Power',
  },
];

export default function AccessoriesSection() {
  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-14 md:mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1d1d1f] tracking-tight">
            Accessories
          </h2>
          <p className="text-[#86868B] mt-3 text-base md:text-lg max-w-lg mx-auto leading-relaxed">
            Everything you need to complete the experience.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {accessories.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                href={`/products?category=accessories`}
                className="group block"
              >
                <div className="bg-[#f5f5f7] rounded-2xl overflow-hidden aspect-[4/3] flex items-center justify-center p-8 mb-4 transition-shadow duration-500 group-hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-contain transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                </div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[#86868B]">{item.category}</span>
                    <h3 className="text-[15px] font-semibold text-[#1d1d1f] mt-0.5 group-hover:text-[#0071e3] transition-colors duration-200">{item.name}</h3>
                    <p className="text-[13px] text-[#86868B] mt-0.5 leading-relaxed">{item.description}</p>
                  </div>
                  <span className="text-[13px] font-semibold text-[#1d1d1f] shrink-0 mt-0.5">{item.price}</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-12"
        >
          <Link
            href="/products?category=accessories"
            className="inline-flex items-center gap-2 text-[14px] font-medium text-[#0071e3] hover:underline underline-offset-4 transition-all"
          >
            View all accessories <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
