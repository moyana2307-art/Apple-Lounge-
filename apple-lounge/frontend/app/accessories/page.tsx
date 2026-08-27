'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { getProductsByCategory } from '@/lib/api';
import { Product } from '@/types';
import ProductCard from '@/components/ProductCard';

const categories = [
  { name: 'AirPods', description: 'Wireless audio experiences' },
  { name: 'Cases & Protection', description: 'Keep your device safe' },
  { name: 'Chargers & Cables', description: 'Power up your devices' },
  { name: 'Apple Watch Bands', description: 'Customize your style' },
];

function SkeletonCard() {
  return (
    <div className="bg-white rounded-3xl border border-apple-border overflow-hidden animate-pulse">
      <div className="aspect-square bg-apple-light" />
      <div className="p-5 space-y-3">
        <div className="h-3 bg-apple-light rounded-full w-1/3" />
        <div className="h-4 bg-apple-light rounded-full w-2/3" />
        <div className="h-5 bg-apple-light rounded-full w-1/4" />
      </div>
    </div>
  );
}

export default function AccessoriesPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProductsByCategory('accessories')
      .then(res => setProducts(res.data))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-apple-dark text-white pt-32 pb-20 md:pt-40 md:pb-24">
        <div className="max-w-6xl mx-auto px-6">
          <nav className="flex items-center gap-2 text-sm text-apple-gray mb-8">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white font-medium">Accessories</span>
          </nav>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.05]"
          >
            Accessories
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl text-apple-gray mt-5 max-w-2xl"
          >
            Complete your Apple experience with genuine accessories.
          </motion.p>
        </div>
      </section>

      {/* Category Pills */}
      <section className="py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map(({ name, description }, i) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="bg-apple-light rounded-3xl p-7 text-center hover:bg-white hover:shadow-md transition-all duration-300 cursor-pointer"
              >
                <p className="font-semibold text-apple-dark mb-1">{name}</p>
                <p className="text-sm text-apple-gray">{description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="pb-24 md:pb-32">
        <div className="max-w-6xl mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl font-bold text-apple-dark tracking-tight mb-10"
          >
            All Accessories
          </motion.h2>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-24"
            >
              <div className="w-28 h-28 bg-apple-light rounded-full flex items-center justify-center mx-auto mb-8">
                <Search className="w-12 h-12 text-apple-gray" strokeWidth={1.5} />
              </div>
              <h2 className="text-2xl font-bold text-apple-dark mb-3">Coming Soon</h2>
              <p className="text-apple-gray mb-10 max-w-md mx-auto">
                We&apos;re updating our accessories collection. Check back soon!
              </p>
              <Link
                href="/products"
                className="inline-flex bg-apple-blue text-white px-10 py-4 rounded-full text-sm font-semibold hover:bg-apple-blue-hover transition-colors"
              >
                Browse All Products
              </Link>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {products.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
