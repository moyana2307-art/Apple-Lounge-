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

          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            style={{ y: textY, fontSize: 'clamp(2.8rem, 8vw, 7.5rem)' }}
            className="font-bold tracking-[-0.04em] leading-[0.88] text-[#1d1d1f] mb-5"
          >
            iPhone 17
            <br />
            <span className="bg-gradient-to-r from-[#1d1d1f] via-[#424245] to-[#86868B] bg-clip-text text-transparent">
              Pro Max
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p variants={fadeUp} className="text-lg md:text-xl text-[#86868B] font-normal max-w-md leading-relaxed mb-6">
            The most powerful iPhone ever.<br className="hidden sm:block" /> Only at Apple Lounge.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={fadeUp} className="flex items-center gap-4 mb-14 md:mb-20">
            <Link
              href="/products?model=iPhone+17+Pro+Max"
              className="inline-flex items-center justify-center bg-[#0071e3] text-white px-7 py-3 rounded-full text-[14px] font-medium hover:bg-[#0077ed] transition-all duration-300 hover:shadow-[0_4px_16px_rgba(0,113,227,0.25)] active:scale-[0.97]"
            >
              Learn more
            </Link>
            <Link
              href="/products?model=iPhone+17+Pro+Max"
              className="inline-flex items-center justify-center text-[#0071e3] px-7 py-3 rounded-full text-[14px] font-medium hover:bg-[#0071e3]/[0.06] transition-all duration-300 active:scale-[0.97]"
            >
              Buy &nbsp;&rarr;
            </Link>
          </motion.div>

          {/* iPhone 17 image — original large card */}
          <motion.div
            variants={scaleIn}
            className="w-full"
          >
            <div className="relative w-full max-w-4xl mx-auto rounded-3xl md:rounded-[2rem] overflow-hidden">
              <img
                src="/Pics/IPhone 17.jpg"
                alt="iPhone 17 Pro Max"
                className="w-full h-auto object-cover aspect-[16/10] md:aspect-[16/9]"
              />
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#f5f5f7] to-transparent pointer-events-none" />
    </section>
  );
}
