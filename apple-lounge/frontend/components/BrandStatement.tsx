'use client';

import { motion } from 'framer-motion';

export default function BrandStatement() {
  return (
    <section className="py-32 md:py-40 bg-white relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(0,113,227,0.04) 0%, transparent 70%)' }}
        />
      </div>
      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-[#1d1d1f] tracking-tight leading-[0.9]">
            Empowering
            <br />
            Connections.
          </h2>
          <p className="mt-6 text-lg md:text-xl text-[#86868B] max-w-xl mx-auto leading-relaxed">
            Your premium destination for iPhones<br className="hidden sm:block" /> in Victoria Falls.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
