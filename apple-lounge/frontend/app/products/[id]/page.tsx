'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRight, Minus, Plus, ShoppingCart, MessageCircle, ArrowLeft, Check } from 'lucide-react';
import { getProduct, getProducts } from '@/lib/api';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { formatPrice, getImageUrl, generateWhatsAppUrl, generateWhatsAppMessage } from '@/lib/utils';
import ProductCard from '@/components/ProductCard';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState('');
  const [addedToCart, setAddedToCart] = useState(false);

  const whatsappPhone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '263771234567';

  useEffect(() => {
    if (!params.id) return;
    setLoading(true);
    getProduct(Number(params.id))
      .then(res => {
        setProduct(res.data);
        const colors = res.data.colors?.split(',').map((c: string) => c.trim()).filter(Boolean);
        if (colors?.length) setSelectedColor(colors[0]);
        return getProducts({ model: res.data.model });
      })
      .then(res => {
        setRelated(res.data.filter((p: Product) => p.id !== Number(params.id)));
      })
      .catch(() => router.push('/products'))
      .finally(() => setLoading(false));
  }, [params.id, router]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity, selectedColor);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleBuyNow = () => {
    if (!product) return;
    addToCart(product, quantity, selectedColor);
    router.push('/checkout');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 pt-28 pb-32">
          <div className="animate-pulse">
            <div className="h-4 bg-[#F5F5F7] rounded-full w-48 mb-10" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
              <div className="aspect-square bg-[#F5F5F7] rounded-3xl" />
              <div className="space-y-6 pt-4">
                <div className="h-3 bg-[#F5F5F7] rounded-full w-24" />
                <div className="h-10 bg-[#F5F5F7] rounded-full w-3/4" />
                <div className="h-5 bg-[#F5F5F7] rounded-full w-1/3" />
                <div className="h-10 bg-[#F5F5F7] rounded-full w-1/4" />
                <div className="flex gap-3">
                  <div className="h-10 w-24 bg-[#F5F5F7] rounded-full" />
                  <div className="h-10 w-24 bg-[#F5F5F7] rounded-full" />
                </div>
                <div className="space-y-3 pt-4">
                  <div className="h-4 bg-[#F5F5F7] rounded-full w-full" />
                  <div className="h-4 bg-[#F5F5F7] rounded-full w-5/6" />
                  <div className="h-4 bg-[#F5F5F7] rounded-full w-2/3" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const colors = product.colors?.split(',').map(c => c.trim()).filter(Boolean);
  const inStock = product.stock > 0;
  const whatsAppMessage = generateWhatsAppMessage(product.name, product.storage, product.price);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 pt-28 pb-32">
        <nav className="flex items-center gap-2 text-sm text-apple-gray mb-10">
          <Link href="/" className="hover:text-apple-dark transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/products" className="hover:text-apple-dark transition-colors">Products</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-apple-dark font-medium truncate">{product.name}</span>
        </nav>

        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-apple-gray hover:text-apple-dark transition-colors mb-10 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span className="text-sm">Back</span>
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="aspect-square bg-[#F5F5F7] rounded-3xl flex items-center justify-center p-10 md:p-14 lg:p-20"
          >
            <img
              src={getImageUrl(product.image)}
              alt={product.name}
              className="w-full h-full object-contain"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="flex flex-col pt-2"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-apple-blue mb-3">
              {product.model}
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold text-apple-dark tracking-tight mb-3">
              {product.name}
            </h1>
            <p className="text-lg text-apple-gray mb-6">{product.storage}</p>

            <div className="text-3xl font-bold text-apple-dark mb-6">{formatPrice(product.price)}</div>

            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-8 w-fit ${
              inStock
                ? 'bg-green-50 text-green-700'
                : 'bg-red-50 text-red-700'
            }`}>
              <div className={`w-2 h-2 rounded-full ${inStock ? 'bg-green-500' : 'bg-red-500'}`} />
              {inStock ? 'In Stock' : 'Out of Stock'}
            </div>

            {colors.length > 0 && (
              <div className="mb-8">
                <p className="text-sm font-medium text-apple-dark mb-3">
                  Color: <span className="text-apple-gray font-normal">{selectedColor}</span>
                </p>
                <div className="flex flex-wrap gap-2.5">
                  {colors.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-5 py-2.5 rounded-full text-sm border transition-all duration-200 ${
                        selectedColor === color
                          ? 'border-apple-dark bg-apple-dark text-white'
                          : 'border-apple-border text-apple-dark hover:border-apple-gray'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-8">
              <p className="text-sm font-medium text-apple-dark mb-3">Quantity</p>
              <div className="inline-flex items-center gap-1 bg-[#F5F5F7] rounded-full p-1">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-semibold text-base">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                  className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-3 mb-10">
              <button
                onClick={handleAddToCart}
                disabled={!inStock}
                className={`w-full flex items-center justify-center gap-3 py-4 rounded-full font-medium transition-all duration-200 ${
                  addedToCart
                    ? 'bg-green-500 text-white'
                    : 'bg-apple-blue text-white hover:bg-apple-blue-hover'
                } ${!inStock ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {addedToCart ? (
                  <>
                    <Check className="w-5 h-5" />
                    Added to Cart
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" />
                    Add to Cart
                  </>
                )}
              </button>
              <button
                onClick={handleBuyNow}
                disabled={!inStock}
                className="w-full py-4 rounded-full font-medium border-2 border-apple-dark text-apple-dark hover:bg-apple-dark hover:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Buy Now
              </button>
              <a
                href={generateWhatsAppUrl(whatsappPhone, whatsAppMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-3 py-4 rounded-full font-medium bg-green-500 text-white hover:bg-green-600 transition-all duration-200"
              >
                <MessageCircle className="w-5 h-5" />
                WhatsApp Us
              </a>
            </div>

            {product.description && (
              <div className="border-t border-apple-border/50 pt-8">
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-apple-gray mb-4">Description</h3>
                <p className="text-apple-gray text-sm leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </div>
            )}
          </motion.div>
        </div>

        {related.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="mt-28"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-apple-dark tracking-tight mb-10">
              Related Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.slice(0, 4).map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.4 + i * 0.08,
                    duration: 0.5,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                >
                  <ProductCard product={p} />
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </div>
  );
}
