'use client';

import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.94 },
  show: { opacity: 1, scale: 1, transition: { duration: 1, ease: [0.22, 1, 0.36, 1] } },
};

export default function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const textY = useTransform(scrollYProgress, [0, 1], [0, -20]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[85vh] md:min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #fbfbfd 0%, #f5f5f7 60%, #eaeaef 100%)' }}
    >
      {/* Subtle radial glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-[55%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] md:w-[1000px] md:h-[1000px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(0,113,227,0.05) 0%, transparent 60%)' }}
        />
      </div>

      <motion.div style={{ opacity }} className="relative z-10 w-full max-w-6xl mx-auto px-6 lg:px-8 pt-24 pb-16 md:pt-32 md:pb-24">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="flex flex-col items-center text-center"
        >
          {/* Victoria Falls badge */}
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm border border-black/[0.04] rounded-full px-4 py-1.5 mb-8 md:mb-10 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full shrink-0" />
            <span className="text-xs font-medium text-[#86868B] tracking-wide">Now in Victoria Falls</span>
          </motion.div>

          <motion.div variants={fadeUp} style={{ y: textY }} className="text-center mb-12 md:mb-16">
            <p className="text-xs md:text-sm font-semibold uppercase tracking-[0.22em] text-[#86868B] mb-4">
              Two flagships. One destination.
            </p>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-[-0.045em] leading-[0.95] text-[#1d1d1f]">
              Meet your next phone.
            </h1>
          </motion.div>

          <div className="grid w-full grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
            <motion.article
              variants={scaleIn}
              className="group relative min-h-[30rem] overflow-hidden rounded-[2rem] bg-[#e7e7eb] text-left shadow-[0_18px_50px_rgba(29,29,31,0.08)] md:min-h-[37rem]"
            >
              <img
                src="/Pics/IPhone 17.jpg"
                alt="iPhone 17 Pro Max"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent" />
              <div className="relative flex h-full min-h-[30rem] flex-col justify-end p-7 text-white md:min-h-[37rem] md:p-9">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-white/70">Apple flagship</p>
                <h2 className="text-3xl font-bold tracking-tight md:text-4xl">iPhone 17 Pro Max</h2>
                <p className="mt-2 max-w-xs text-sm leading-relaxed text-white/80">The most powerful iPhone ever. Only at Apple Lounge.</p>
                <Link
                  href="/products?model=iPhone+17+Pro+Max"
                  className="mt-6 inline-flex w-fit items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#1d1d1f] transition-all duration-300 hover:bg-white/90 hover:shadow-[0_6px_22px_rgba(255,255,255,0.25)] active:scale-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  Explore iPhone <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
                </Link>
              </div>
            </motion.article>

            <motion.article
              variants={scaleIn}
              className="group relative min-h-[30rem] overflow-hidden rounded-[2rem] bg-[#273641] text-left shadow-[0_18px_50px_rgba(39,54,65,0.16)] md:min-h-[37rem]"
            >
              <img
                src="/Pics/s26.webp"
                alt="Samsung Galaxy S26"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#17232b]/80 via-[#17232b]/10 to-transparent" />
              <div className="relative flex h-full min-h-[30rem] flex-col justify-end p-7 text-white md:min-h-[37rem] md:p-9">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-white/70">New from Samsung</p>
                <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Galaxy S26</h2>
                <p className="mt-2 max-w-xs text-sm leading-relaxed text-white/80">The latest Samsung Galaxy S26 has arrived.</p>
                <Link
                  href="/products?model=Samsung+Galaxy+S26"
                  className="mt-6 inline-flex w-fit items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#1d1d1f] transition-all duration-300 hover:bg-white/90 hover:shadow-[0_6px_22px_rgba(255,255,255,0.25)] active:scale-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  Explore Galaxy S26 <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
                </Link>
              </div>
            </motion.article>
          </div>
        </motion.div>
      </motion.div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#f5f5f7] to-transparent pointer-events-none" />
    </section>
  );
}
