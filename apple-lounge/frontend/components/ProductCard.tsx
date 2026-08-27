'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Product } from '@/types';
import { formatPrice, getImageUrl } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  compact?: boolean;
}

const COLOR_MAP: Record<string, string> = {
  Black: '#1D1D1F',
  White: '#F5F5F7',
  Blue: '#0071E3',
  Green: '#34C759',
  Pink: '#FF2D55',
  Purple: '#AF52DE',
  'Deep Purple': '#6B3FA0',
  'Alpine Green': '#3A7D44',
  'Pacific Blue': '#4A6FA5',
  'Sierra Blue': '#7BA3C9',
  Yellow: '#FFCC00',
  Red: '#FF3B30',
  'Natural Titanium': '#86868B',
  'Blue Titanium': '#3B4856',
  'White Titanium': '#E3D0BF',
  'Black Titanium': '#3C3C3C',
  'Desert Titanium': '#C2B5A3',
  Silver: '#C0C0C0',
  Gold: '#FFD700',
  Midnight: '#1D1D1F',
  Starlight: '#F0E6D3',
  Teal: '#30B0A0',
  Ultramarine: '#3E54D3',
};

export default function ProductCard({ product, compact = false }: ProductCardProps) {
  const colors = product.colors
    ? product.colors.split(',').map((c) => c.trim()).filter(Boolean)
    : [];

  const stockLabel =
    product.stock > 5
      ? 'In Stock'
      : product.stock > 0
        ? `Only ${product.stock} left`
        : 'Out of Stock';

  const stockColor =
    product.stock > 5
      ? 'bg-emerald-50 text-emerald-600'
      : product.stock > 0
        ? 'bg-amber-50 text-amber-600'
        : 'bg-red-50 text-red-500';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
      className="group relative flex flex-col bg-white rounded-2xl overflow-hidden transition-shadow duration-300 hover:shadow-[0_4px_24px_rgba(0,0,0,0.06)]"
    >
      {product.featured && (
        <span className="absolute top-3 left-3 z-10 inline-flex items-center rounded-full bg-apple-dark/5 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-apple-dark backdrop-blur-sm">
          Featured
        </span>
      )}

      <Link href={`/products/${product.id}`} className="block">
        <div
          className={`relative flex items-center justify-center overflow-hidden bg-apple-light ${
            compact ? 'px-4 py-6' : 'px-8 py-12'
          }`}
        >
          <img
            src={getImageUrl(product.image)}
            alt={product.name}
            className={`w-full object-contain transition-transform duration-500 ease-out group-hover:scale-105 ${
              compact ? 'h-36' : 'h-56'
            }`}
          />
        </div>
      </Link>

      <div className={`flex flex-1 flex-col ${compact ? 'p-4' : 'p-5'}`}>
        <div className="mb-1">
          <p className="text-[11px] font-medium uppercase tracking-wider text-apple-gray">
            {product.model}
          </p>
        </div>

        <Link href={`/products/${product.id}`}>
          <h3
            className={`font-semibold text-apple-dark transition-colors duration-200 hover:text-apple-blue ${
              compact ? 'text-sm' : 'text-base'
            }`}
            style={{ textWrap: 'balance' }}
          >
            {product.name}
          </h3>
        </Link>

        <p className="mt-0.5 text-xs text-apple-gray">{product.storage}</p>

        {colors.length > 0 && (
          <div className="mt-3 flex items-center gap-1.5">
            {colors.slice(0, 5).map((color) => (
              <span
                key={color}
                title={color}
                className="inline-block h-3 w-3 rounded-full border border-black/[0.08]"
                style={{ backgroundColor: COLOR_MAP[color] || '#86868B' }}
              />
            ))}
            {colors.length > 5 && (
              <span className="text-[10px] text-apple-gray">
                +{colors.length - 5}
              </span>
            )}
          </div>
        )}

        <div className="mt-auto pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className={`font-bold text-apple-dark ${
                  compact ? 'text-base' : 'text-lg'
                }`}
              >
                {product.price_label || formatPrice(product.price)}
              </span>
              <span
                className={`inline-flex items-center rounded-full px-2 py-px text-[10px] font-medium leading-5 ${stockColor}`}
              >
                {stockLabel}
              </span>
            </div>

            <Link
              href={`/products/${product.id}`}
              className="inline-flex items-center gap-1 text-sm font-medium text-apple-blue transition-colors duration-200 hover:text-apple-blue-hover"
            >
              View
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 ease-out group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
