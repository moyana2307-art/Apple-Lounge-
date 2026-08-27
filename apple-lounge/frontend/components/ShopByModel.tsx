'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const models = [
  { name: 'iPhone 17', tagline: 'The future. Here.', price: 'From $1,199', image: '/Pics/iphone 17pro.jpg' },
  { name: 'iPhone 16', tagline: 'A mighty leap.', price: 'From $899', image: '/Pics/iphone 16 pro.jpg' },
  { name: 'iPhone 15', tagline: 'Forged in titanium.', price: 'From $799', image: '/Pics/iphone 15 pro.jpg' },
  { name: 'iPhone 14', tagline: 'All-screen. All pro.', price: 'From $699', image: '/Pics/iphone 14 pro.jpg' },
  { name: 'iPhone 13', tagline: 'A complete powerhouse.', price: 'From $599', image: '/Pics/iphone 13 pr.webp' },
  { name: 'iPhone 12', tagline: 'Speed. Wicked fast.', price: 'From $499', image: '/Pics/iphone 12 pro.avif' },
  { name: 'iPhone 11', tagline: 'Done right.', price: 'From $399', image: '/Pics/iphone 11 pro max.png' },
];

export default function ShopByModel() {
  return (
    <section className="py-24 md:py-32 bg-[#f5f5f7]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-14 md:mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1d1d1f] tracking-tight">
            Meet the iPhone family.
          </h2>
          <p className="text-[#86868B] mt-3 text-base md:text-lg max-w-lg mx-auto leading-relaxed">
            Find the perfect iPhone for you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {models.map((model, index) => (
            <motion.div
              key={model.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                href={`/products?model=${encodeURIComponent(model.name)}`}
                className="group relative block bg-[#1d1d1f] rounded-2xl overflow-hidden h-72 sm:h-80 transition-all duration-500 hover:shadow-[0_8px_40px_rgba(0,0,0,0.15)]"
              >
                <img
                  src={model.image}
                  alt={model.name}
                  className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-75 group-hover:scale-105 transition-all duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                <div className="relative h-full flex flex-col justify-between p-7">
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-none">{model.name}</h3>
                    <p className="text-white/60 text-sm mt-1.5 font-medium">{model.tagline}</p>
                  </div>
                  <div className="flex items-end justify-between">
                    <span className="text-sm text-white/50 font-medium">{model.price}</span>
                    <span className="inline-flex items-center gap-1 text-[13px] font-medium text-white/80 group-hover:text-white group-hover:gap-2 transition-all duration-300">
                      Explore <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
