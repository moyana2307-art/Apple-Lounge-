'use client';

import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingCart, Menu, X } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import SearchModal from './SearchModal';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/products?category=iphones', label: 'iPhones' },
  { href: '/products?category=samsung', label: 'Samsung Galaxy' },
  { href: '/products?category=accessories', label: 'Accessories' },
  { href: '/products?sort=price_asc', label: 'Deals' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const { totalItems, setIsOpen } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const handleScroll = useCallback(() => setScrolled(window.scrollY > 20), []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-white/80 backdrop-blur-xl border-b border-black/[0.04] shadow-[0_1px_2px_rgba(0,0,0,0.03)]'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="max-w-[980px] mx-auto px-5 md:px-8">
          <div className="flex items-center justify-between h-[44px] md:h-[48px]">

            <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
              <img src="/Pics/apple.jpeg" alt="" className="w-5 h-5 object-contain opacity-80" />
              <span className="text-[15px] font-semibold tracking-[-0.01em] text-[#1d1d1f]">Apple Lounge</span>
            </Link>

            <div className="hidden lg:flex items-center -space-x-0.5">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-3 py-1.5 text-[12px] font-normal text-[#1d1d1f]/60 hover:text-[#1d1d1f] rounded-full hover:bg-black/[0.04] transition-all duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-0.5">
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 rounded-full text-[#1d1d1f]/50 hover:text-[#1d1d1f] hover:bg-black/[0.04] transition-all duration-200"
                aria-label="Search"
              >
                <Search className="w-[17px] h-[17px]" strokeWidth={1.8} />
              </button>

              <button
                onClick={() => setIsOpen(true)}
                className="relative p-2 rounded-full text-[#1d1d1f]/50 hover:text-[#1d1d1f] hover:bg-black/[0.04] transition-all duration-200"
                aria-label="Cart"
              >
                <ShoppingCart className="w-[17px] h-[17px]" strokeWidth={1.8} />
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                    className="absolute -top-0.5 -right-0.5 min-w-[15px] h-[15px] px-1 bg-[#0071e3] text-white text-[9px] font-semibold rounded-full flex items-center justify-center leading-none ring-2 ring-white"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </button>

              <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden p-2 rounded-full text-[#1d1d1f]/50 hover:text-[#1d1d1f] hover:bg-black/[0.04] transition-all duration-200"
                aria-label="Menu"
              >
                <Menu className="w-[17px] h-[17px]" strokeWidth={1.8} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60]"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 320 }}
              className="fixed inset-y-0 right-0 w-full max-w-[300px] bg-white/95 backdrop-blur-2xl z-[70] shadow-[-8px_0_40px_rgba(0,0,0,0.08)]"
            >
              <div className="flex items-center justify-between px-5 h-[44px] border-b border-black/[0.06]">
                <Link href="/" className="text-[14px] font-semibold text-[#1d1d1f]" onClick={() => setMobileOpen(false)}>
                  Apple Lounge
                </Link>
                <button onClick={() => setMobileOpen(false)} className="p-1.5 -mr-1 rounded-full hover:bg-black/[0.04] transition-colors">
                  <X className="w-4 h-4 text-[#86868B]" strokeWidth={1.75} />
                </button>
              </div>

              <div className="px-3 py-4 space-y-0.5">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.035, duration: 0.25 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="block px-4 py-2.5 text-[14px] text-[#1d1d1f]/70 hover:text-[#1d1d1f] hover:bg-black/[0.04] rounded-xl transition-colors"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-5 border-t border-black/[0.06]">
                <a
                  href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '263771234567'}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center bg-[#1d1d1f] text-white text-[13px] font-medium py-2.5 rounded-full hover:bg-black transition-colors"
                >
                  Chat on WhatsApp
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
