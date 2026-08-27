'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getProductsByCategory } from '@/lib/api';
import { Product } from '@/types';
import ProductCard from '@/components/ProductCard';

export default function SamsungSection() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    getProductsByCategory('samsung')
      .then((res) => setProducts(res.data))
      .catch(() => setProducts([]));
  }, []);

  if (products.length === 0) return null;

  return (
    <section className="border-y border-black/[0.04] bg-[#f5f5f7] py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-14 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#86868B]">
              Android, refined
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-[#1d1d1f] md:text-4xl lg:text-5xl">
              Samsung Galaxy
            </h2>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-[#86868B] md:text-lg">
              Explore the latest Galaxy smartphones, from the S21 Ultra to the all-new S26 Ultra.
            </p>
          </div>
          <Link
            href="/products?category=samsung"
            className="inline-flex shrink-0 items-center gap-2 text-sm font-medium text-[#0071e3] hover:underline"
          >
            View all Galaxy phones <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}