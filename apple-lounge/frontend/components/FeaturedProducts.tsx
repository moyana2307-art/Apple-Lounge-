'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { getFeaturedProducts } from '@/lib/api';
import { Product } from '@/types';
import { formatPrice, getImageUrl } from '@/lib/utils';

function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden bg-white border border-black/[0.04]">
      <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-50 animate-pulse" />
      <div className="p-6 space-y-3">
        <div className="h-3 bg-gray-100 rounded-full w-1/3 animate-pulse" />
        <div className="h-5 bg-gray-100 rounded-full w-3/4 animate-pulse" />
        <div className="h-4 bg-gray-100 rounded-full w-1/2 animate-pulse mt-3" />
      </div>
    </div>
  );
}

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFeaturedProducts()
      .then((res) => setProducts(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-16">
            <div className="h-8 bg-gray-100 rounded-full w-64 mx-auto animate-pulse" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

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
            Explore iPhone 17
          </h2>
          <p className="text-[#86868B] mt-3 text-base md:text-lg max-w-lg mx-auto leading-relaxed">
            Handpicked devices, ready for you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {products.slice(0, 4).map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.55, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link href={`/products/${product.id}`} className="group block">
                <div className="relative bg-[#f5f5f7] rounded-2xl overflow-hidden mb-4 aspect-square flex items-center justify-center p-6">
                  <img
                    src={getImageUrl(product.image)}
                    alt={product.name}
                    className="w-full h-full object-contain transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                  {product.featured && (
                    <span className="absolute top-3 left-3 inline-flex items-center rounded-full bg-[#1d1d1f]/5 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#1d1d1f]">
                      Featured
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-wider text-[#86868B] mb-0.5">{product.model}</p>
                    <h3 className="text-[15px] font-semibold text-[#1d1d1f] group-hover:text-[#0071e3] transition-colors duration-200">{product.name}</h3>
                    <p className="text-sm text-[#86868B] mt-0.5">{product.storage}</p>
                  </div>
                  <div className="text-right shrink-0 ml-3">
                    <p className="text-[15px] font-bold text-[#1d1d1f]">{formatPrice(product.price)}</p>
                    <span className="inline-flex items-center gap-0.5 text-[13px] font-medium text-[#0071e3] mt-1 group-hover:gap-1.5 transition-all duration-300">
                      Learn more <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
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
            href="/products?category=iphones"
            className="inline-flex items-center gap-2 text-[14px] font-medium text-[#0071e3] hover:underline underline-offset-4 transition-all"
          >
            View all iPhones <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
