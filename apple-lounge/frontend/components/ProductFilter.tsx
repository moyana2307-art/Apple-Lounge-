'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, X } from 'lucide-react';

interface FilterState {
  models: string[];
  storage: string[];
  priceRange: string;
  sort: string;
}

interface ProductFilterProps {
  models: string[];
  onFilterChange: (filters: FilterState) => void;
}

const storageOptions = ['64GB', '128GB', '256GB', '512GB', '1TB'];
const priceRanges = [
  { label: 'All Prices', value: '' },
  { label: 'Under $500', value: '0-500' },
  { label: '$500 - $800', value: '500-800' },
  { label: '$800 - $1,200', value: '800-1200' },
  { label: 'Over $1,200', value: '1200-99999' },
];
const sortOptions = [
  { label: 'Newest', value: 'newest' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Name: A-Z', value: 'name_asc' },
];

export default function ProductFilter({ models, onFilterChange }: ProductFilterProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    models: [],
    storage: [],
    priceRange: '',
    sort: 'newest',
  });

  const updateFilters = (partial: Partial<FilterState>) => {
    const next = { ...filters, ...partial };
    setFilters(next);
    onFilterChange(next);
  };

  const toggleArrayFilter = (key: 'models' | 'storage', value: string) => {
    const arr = filters[key];
    const next = arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
    updateFilters({ [key]: next });
  };

  const activeCount =
    filters.models.length + filters.storage.length + (filters.priceRange ? 1 : 0);

  const FilterContent = () => (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-apple-dark">Model</h3>
          {filters.models.length > 0 && (
            <button
              onClick={() => updateFilters({ models: [] })}
              className="text-xs text-apple-blue hover:underline"
            >
              Clear
            </button>
          )}
        </div>
        <div className="space-y-2">
          {models.map((model) => (
            <label key={model} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.models.includes(model)}
                onChange={() => toggleArrayFilter('models', model)}
                className="w-4 h-4 rounded border-apple-border text-apple-blue focus:ring-apple-blue"
              />
              <span className="text-sm text-apple-gray group-hover:text-apple-dark transition-colors">
                {model}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-apple-dark">Storage</h3>
          {filters.storage.length > 0 && (
            <button
              onClick={() => updateFilters({ storage: [] })}
              className="text-xs text-apple-blue hover:underline"
            >
              Clear
            </button>
          )}
        </div>
        <div className="space-y-2">
          {storageOptions.map((size) => (
            <label key={size} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.storage.includes(size)}
                onChange={() => toggleArrayFilter('storage', size)}
                className="w-4 h-4 rounded border-apple-border text-apple-blue focus:ring-apple-blue"
              />
              <span className="text-sm text-apple-gray group-hover:text-apple-dark transition-colors">
                {size}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-apple-dark mb-3">Price Range</h3>
        <select
          value={filters.priceRange}
          onChange={(e) => updateFilters({ priceRange: e.target.value })}
          className="w-full px-3 py-2 bg-apple-light border border-apple-border rounded-lg text-sm text-apple-dark outline-none focus:ring-2 focus:ring-apple-blue"
        >
          {priceRanges.map((range) => (
            <option key={range.value} value={range.value}>
              {range.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-apple-dark mb-3">Sort By</h3>
        <select
          value={filters.sort}
          onChange={(e) => updateFilters({ sort: e.target.value })}
          className="w-full px-3 py-2 bg-apple-light border border-apple-border rounded-lg text-sm text-apple-dark outline-none focus:ring-2 focus:ring-apple-blue"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {activeCount > 0 && (
        <button
          onClick={() => {
            const reset: FilterState = { models: [], storage: [], priceRange: '', sort: filters.sort };
            setFilters(reset);
            onFilterChange(reset);
          }}
          className="w-full py-2.5 text-sm font-medium text-apple-blue hover:bg-apple-light rounded-lg transition-colors border border-apple-border"
        >
          Reset All Filters
        </button>
      )}
    </div>
  );

  return (
    <>
      <div className="hidden lg:block bg-white rounded-2xl border border-apple-border p-5">
        <div className="flex items-center gap-2 mb-5">
          <SlidersHorizontal className="w-4 h-4 text-apple-dark" />
          <h2 className="text-sm font-semibold text-apple-dark">Filters</h2>
        </div>
        <FilterContent />
      </div>

      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 bg-apple-dark text-white px-5 py-3 rounded-full shadow-lg text-sm font-medium"
      >
        <SlidersHorizontal className="w-4 h-4" />
        Filters
        {activeCount > 0 && (
          <span className="bg-apple-blue text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
            {activeCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed inset-x-0 bottom-0 bg-white z-50 rounded-t-3xl max-h-[80vh] overflow-y-auto lg:hidden"
            >
              <div className="sticky top-0 bg-white flex items-center justify-between p-4 border-b border-apple-border">
                <h2 className="text-lg font-semibold text-apple-dark">Filters</h2>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 rounded-full hover:bg-apple-light transition-colors"
                >
                  <X className="w-5 h-5 text-apple-dark" />
                </button>
              </div>
              <div className="p-4">
                <FilterContent />
                <button
                  onClick={() => setMobileOpen(false)}
                  className="w-full mt-6 py-3 bg-apple-blue text-white rounded-full font-medium hover:bg-apple-blue-hover transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
