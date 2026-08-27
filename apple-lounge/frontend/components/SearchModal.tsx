'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Product } from '@/types';
import { getProducts } from '@/lib/api';
import { formatPrice, getImageUrl } from '@/lib/utils';

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

export default function SearchModal({ open, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [open]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [open, onClose]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const search = useCallback(async (q: string) => {
    if (q.trim().length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await getProducts({ search: q.trim(), limit: '6' });
      setResults(res.data || []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleQueryChange = (value: string) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(value), 350);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-0 left-0 right-0 z-[110] bg-white shadow-2xl border-b border-apple-border"
          >
            <div className="max-w-3xl mx-auto px-4 py-4">
              <div className="flex items-center gap-3">
                <Search className="w-5 h-5 text-apple-gray shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => handleQueryChange(e.target.value)}
                  placeholder="Search iPhones, accessories..."
                  className="flex-1 text-lg text-apple-dark placeholder:text-apple-gray outline-none bg-transparent"
                />
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-apple-light transition-colors"
                >
                  <X className="w-5 h-5 text-apple-gray" />
                </button>
              </div>

              {loading && (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 text-apple-blue animate-spin" />
                </div>
              )}

              {!loading && results.length > 0 && (
                <div className="py-4 space-y-1 max-h-96 overflow-y-auto">
                  {results.map((product) => (
                    <Link
                      key={product.id}
                      href={`/products/${product.id}`}
                      onClick={onClose}
                      className="flex items-center gap-4 p-3 rounded-xl hover:bg-apple-light transition-colors"
                    >
                      <div className="w-12 h-12 bg-apple-light rounded-lg flex items-center justify-center shrink-0">
                        <img
                          src={getImageUrl(product.image)}
                          alt={product.name}
                          className="w-10 h-10 object-contain"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-apple-dark truncate">{product.name}</p>
                        <p className="text-xs text-apple-gray">{product.model} &middot; {product.storage}</p>
                      </div>
                      <span className="text-sm font-bold text-apple-dark shrink-0">
                        {formatPrice(product.price)}
                      </span>
                    </Link>
                  ))}
                </div>
              )}

              {!loading && query.length >= 2 && results.length === 0 && (
                <div className="py-8 text-center">
                  <p className="text-sm text-apple-gray">No products found for &ldquo;{query}&rdquo;</p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
