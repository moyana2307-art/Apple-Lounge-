'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, X, ChevronRight, ChevronDown } from 'lucide-react';
import { getProducts, getModels } from '@/lib/api';
import { Product } from '@/types';
import ProductCard from '@/components/ProductCard';

const categories = [
  { label: 'All', value: 'All' },
  { label: 'iPhone', value: 'iphones' },
  { label: 'Samsung Galaxy', value: 'samsung' },
  { label: 'iPad', value: 'ipads' },
  { label: 'Mac', value: 'mac' },
  { label: 'Apple Watch', value: 'apple-watch' },
  { label: 'Accessories', value: 'accessories' },
];
const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'name', label: 'Name A-Z' },
];

function ProductSkeleton() {
  return (
    <div className="bg-white rounded-3xl border border-apple-border/50 overflow-hidden animate-pulse">
      <div className="aspect-square bg-[#F5F5F7]" />
      <div className="p-5 space-y-3">
        <div className="h-3 bg-[#F5F5F7] rounded-full w-1/3" />
        <div className="h-4 bg-[#F5F5F7] rounded-full w-2/3" />
        <div className="h-3 bg-[#F5F5F7] rounded-full w-1/4" />
        <div className="flex justify-between items-center pt-2">
          <div className="h-5 bg-[#F5F5F7] rounded-full w-1/4" />
          <div className="h-9 w-9 bg-[#F5F5F7] rounded-full" />
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [models, setModels] = useState<string[]>([]);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [totalResults, setTotalResults] = useState(0);

  const category = searchParams.get('category') || 'All';
  const sort = searchParams.get('sort') || 'newest';
  const model = searchParams.get('model') || '';
  const featured = searchParams.get('featured') || '';
  const categoryLabel = category === 'All' ? 'All iPhones' : category === 'samsung' ? 'Samsung Galaxy' : category === 'iphones' ? 'All iPhones' : category;

  const updateParam = useCallback((key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== 'All') {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/products?${params.toString()}`);
  }, [searchParams, router]);

  useEffect(() => {
    getModels()
      .then(res => setModels(res.data.map((m: any) => typeof m === 'string' ? m : m.model)))
      .catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params: Record<string, string> = {};
    if (category && category !== 'All') params.category = category;
    if (sort) params.sort = sort;
    if (model) params.model = model;
    if (featured) params.featured = featured;
    if (searchQuery) params.search = searchQuery;

    getProducts(params)
      .then(res => {
        setProducts(res.data);
        setTotalResults(res.pagination?.total || res.data.length);
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [category, sort, model, featured, searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateParam('search', searchQuery);
  };

  const FilterContent = () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-apple-gray mb-3">Category</h3>
        <div className="space-y-0.5">
          {categories.map(cat => (
            <button
              key={cat.value}
              onClick={() => updateParam('category', cat.value)}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                category === cat.value
                  ? 'bg-apple-dark text-white font-medium'
                  : 'text-apple-gray hover:bg-[#F5F5F7] hover:text-apple-dark'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {models.length > 0 && (
        <div>
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-apple-gray mb-3">Model</h3>
          <div className="space-y-0.5">
            <button
              onClick={() => updateParam('model', '')}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                !model
                  ? 'bg-apple-dark text-white font-medium'
                  : 'text-apple-gray hover:bg-[#F5F5F7] hover:text-apple-dark'
              }`}
            >
              All Models
            </button>
            {models.map(m => (
              <button
                key={m}
                onClick={() => updateParam('model', m)}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                  model === m
                    ? 'bg-apple-dark text-white font-medium'
                    : 'text-apple-gray hover:bg-[#F5F5F7] hover:text-apple-dark'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-apple-gray mb-3">Sort By</h3>
        <div className="space-y-0.5">
          {sortOptions.map(opt => (
            <button
              key={opt.value}
              onClick={() => updateParam('sort', opt.value)}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                sort === opt.value
                  ? 'bg-apple-dark text-white font-medium'
                  : 'text-apple-gray hover:bg-[#F5F5F7] hover:text-apple-dark'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 pt-28 pb-32">
        <nav className="flex items-center gap-2 text-sm text-apple-gray mb-10">
          <Link href="/" className="hover:text-apple-dark transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-apple-dark font-medium">Products</span>
        </nav>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mb-12"
        >
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-apple-dark tracking-tight">
            {categoryLabel}
          </h1>
          {!loading && (
            <p className="text-lg text-apple-gray mt-4">
              {totalResults} {totalResults === 1 ? 'product' : 'products'} available
            </p>
          )}
        </motion.div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-end gap-4 mb-10">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <form onSubmit={handleSearch} className="relative flex-1 md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-apple-gray" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-11 pr-10 py-3 bg-[#F5F5F7] border border-transparent rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-apple-blue/30 focus:border-apple-blue focus:bg-white transition-all duration-200"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => { setSearchQuery(''); updateParam('search', ''); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                >
                  <X className="w-4 h-4 text-apple-gray hover:text-apple-dark transition-colors" />
                </button>
              )}
            </form>

            <div className="relative hidden md:block">
              <select
                value={sort}
                onChange={e => updateParam('sort', e.target.value)}
                className="appearance-none bg-[#F5F5F7] border border-transparent rounded-2xl px-5 py-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-apple-blue/30 focus:border-apple-blue cursor-pointer transition-all duration-200"
              >
                {sortOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-apple-gray pointer-events-none" />
            </div>

            <button
              onClick={() => setMobileFilterOpen(true)}
              className="md:hidden p-3 bg-[#F5F5F7] border border-transparent rounded-2xl hover:bg-apple-border/30 transition-all duration-200"
            >
              <SlidersHorizontal className="w-4 h-4 text-apple-dark" />
            </button>
          </div>
        </div>

        <div className="flex gap-10">
          <aside className="hidden md:block w-56 flex-shrink-0">
            <div className="sticky top-28">
              <FilterContent />
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <ProductSkeleton key={i} />
                ))}
              </div>
            ) : products.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center py-32"
              >
                <div className="w-24 h-24 bg-[#F5F5F7] rounded-full flex items-center justify-center mx-auto mb-8">
                  <Search className="w-10 h-10 text-apple-gray/50" />
                </div>
                <h2 className="text-2xl font-semibold text-apple-dark mb-3">No products found</h2>
                <p className="text-apple-gray mb-8 text-lg">Try adjusting your search or filter criteria</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    router.push('/products');
                  }}
                  className="bg-apple-blue text-white px-8 py-3.5 rounded-full text-sm font-medium hover:bg-apple-blue-hover transition-all duration-200"
                >
                  Clear Filters
                </button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {products.map((product, i) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: i * 0.06,
                      duration: 0.5,
                      ease: [0.25, 0.46, 0.45, 0.94],
                    }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileFilterOpen(false)}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="absolute right-0 top-0 h-full w-80 bg-white shadow-2xl p-8 overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-lg font-semibold text-apple-dark">Filters</h2>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-8 h-8 bg-[#F5F5F7] rounded-full flex items-center justify-center hover:bg-apple-border/50 transition-colors"
              >
                <X className="w-4 h-4 text-apple-dark" />
              </button>
            </div>
            <FilterContent />
          </motion.div>
        </div>
      )}
    </div>
  );
}
