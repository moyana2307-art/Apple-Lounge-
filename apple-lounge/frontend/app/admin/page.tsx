'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Package, ShoppingCart, DollarSign, Clock, RefreshCw, Loader2,
  LogOut, Plus, Pencil, Trash2, X, Upload, Star, Search
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import {
  getDashboardStats, getOrders, updateOrderStatus,
  getProducts, createProduct, updateProduct, deleteProduct, uploadImage
} from '@/lib/api';
import { DashboardStats, Order, Product } from '@/types';
import { formatPrice, getImageUrl } from '@/lib/utils';

type Tab = 'overview' | 'orders' | 'products';
type ModalMode = 'add' | 'edit' | null;

const emptyProduct = {
  name: '', model: '', storage: '', price: 0,
  description: '', category: 'iphones', image: '', stock: 0,
  featured: false, colors: 'Black,White,Blue',
};

export default function AdminDashboard() {
  const { user, isAdmin, loading: authLoading, logout } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [updatingOrder, setUpdatingOrder] = useState<number | null>(null);

  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [editProduct, setEditProduct] = useState(emptyProduct);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [productSearch, setProductSearch] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  useEffect(() => {
    if (!authLoading && !user) router.push('/admin/login');
  }, [user, authLoading, router]);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [statsRes, ordersRes, productsRes] = await Promise.allSettled([
        getDashboardStats(),
        getOrders(),
        getProducts({ limit: '100' }),
      ]);
      if (statsRes.status === 'fulfilled') setStats(statsRes.value.data);
      if (ordersRes.status === 'fulfilled') setOrders(ordersRes.value.data || []);
      if (productsRes.status === 'fulfilled') setProducts(productsRes.value.data || []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user && isAdmin) loadData();
  }, [user, isAdmin, loadData]);

  const handleStatusUpdate = async (orderId: number, status: string) => {
    setUpdatingOrder(orderId);
    try {
      await updateOrderStatus(orderId, { status });
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: status as Order['status'] } : o));
    } catch { alert('Failed to update order status'); }
    finally { setUpdatingOrder(null); }
  };

  const handlePaymentUpdate = async (orderId: number, payment_status: string) => {
    setUpdatingOrder(orderId);
    try {
      await updateOrderStatus(orderId, { payment_status });
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, payment_status: payment_status as Order['payment_status'] } : o));
    } catch { alert('Failed to update payment status'); }
    finally { setUpdatingOrder(null); }
  };

  const openAddModal = () => { setEditProduct(emptyProduct); setModalMode('add'); };
  const openEditModal = (p: Product) => {
    setEditProduct({ name: p.name, model: p.model, storage: p.storage || '', price: p.price, description: p.description || '', category: p.category || 'iphones', image: p.image || '', stock: p.stock, featured: p.featured, colors: p.colors || 'Black,White,Blue' });
    setModalMode('edit');
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadImage(file);
      if (res.data?.url) setEditProduct(prev => ({ ...prev, image: res.data.url }));
    } catch { alert('Failed to upload image'); }
    finally { setUploading(false); }
  };

  const handleSaveProduct = async () => {
    setSaving(true);
    try {
      if (modalMode === 'add') {
        const res = await createProduct(editProduct);
        setProducts(prev => [res.data, ...prev]);
      } else if (modalMode === 'edit') {
        const idx = products.findIndex(p => p.name === editProduct.name);
        if (idx >= 0) {
          const productId = products[idx].id;
          const res = await updateProduct(productId, editProduct);
          setProducts(prev => prev.map(p => p.id === productId ? res.data : p));
        }
      }
      setModalMode(null);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to save product');
    } finally { setSaving(false); }
  };

  const handleDeleteProduct = async (id: number) => {
    try {
      await deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
      setDeleteConfirm(null);
    } catch { alert('Failed to delete product'); }
  };

  const toggleFeatured = async (product: Product) => {
    try {
      const res = await updateProduct(product.id, { featured: !product.featured });
      setProducts(prev => prev.map(p => p.id === product.id ? res.data : p));
    } catch { alert('Failed to update'); }
  };

  if (authLoading || (!user && !authLoading)) {
    return <div className="min-h-screen flex items-center justify-center bg-apple-light"><Loader2 className="w-8 h-8 text-apple-blue animate-spin" /></div>;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-apple-light">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-apple-dark mb-2">Access Denied</h1>
          <p className="text-apple-gray mb-6">You need admin privileges to access this page.</p>
          <Link href="/" className="bg-apple-blue text-white px-6 py-3 rounded-full font-medium hover:bg-apple-blue-hover transition-colors">Go Home</Link>
        </div>
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-700', processing: 'bg-blue-100 text-blue-700',
    shipped: 'bg-purple-100 text-purple-700', delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
  };
  const paymentColors: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-700', paid: 'bg-green-100 text-green-700',
    failed: 'bg-red-100 text-red-700', refunded: 'bg-gray-100 text-gray-700',
  };

  const filteredProducts = products.filter(p =>
    !productSearch || p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.model.toLowerCase().includes(productSearch.toLowerCase())
  );

  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'orders', label: 'Orders', count: orders.length },
    { id: 'products', label: 'Products', count: products.length },
  ];

  return (
    <div className="min-h-screen bg-apple-light">
      <div className="bg-white border-b border-apple-border sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Link href="/" className="text-lg font-bold text-apple-dark">Apple Lounge</Link>
              <span className="text-apple-gray">/</span>
              <span className="text-sm font-medium text-apple-blue">Admin</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-apple-gray hidden sm:block">{user?.name}</span>
              <button onClick={loadData} className="p-2 rounded-full hover:bg-apple-light transition-colors" title="Refresh">
                <RefreshCw className="w-4 h-4 text-apple-gray" />
              </button>
              <button onClick={logout} className="p-2 rounded-full hover:bg-apple-light transition-colors" title="Logout">
                <LogOut className="w-4 h-4 text-apple-gray" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-1 mb-8 bg-white rounded-xl p-1 border border-apple-border w-fit">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === t.id ? 'bg-apple-blue text-white' : 'text-apple-gray hover:text-apple-dark'}`}>
              {t.label}{t.count !== undefined ? ` (${t.count})` : ''}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 text-apple-blue animate-spin" /></div>
        ) : activeTab === 'overview' ? (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: Package, label: 'Products', value: stats?.totalProducts || 0, color: 'text-blue-500' },
                { icon: ShoppingCart, label: 'Total Orders', value: stats?.totalOrders || 0, color: 'text-purple-500' },
                { icon: Clock, label: 'Pending Orders', value: stats?.pendingOrders || 0, color: 'text-amber-500' },
                { icon: DollarSign, label: 'Total Sales', value: formatPrice(stats?.totalSales || 0), color: 'text-green-500' },
              ].map(({ icon: Icon, label, value, color }, i) => (
                <motion.div key={label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  className="bg-white rounded-2xl p-5 border border-apple-border">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-apple-gray">{label}</span>
                    <Icon className={`w-5 h-5 ${color}`} />
                  </div>
                  <p className="text-2xl font-bold text-apple-dark">{value}</p>
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl p-6 border border-apple-border">
                <h3 className="text-lg font-semibold text-apple-dark mb-4">Recent Orders</h3>
                <div className="space-y-3">
                  {orders.slice(0, 5).map(order => (
                    <div key={order.id} className="flex items-center justify-between p-3 bg-apple-light rounded-xl">
                      <div>
                        <p className="text-sm font-medium text-apple-dark">#{order.id} - {order.customer_name}</p>
                        <p className="text-xs text-apple-gray">{new Date(order.created_at).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-apple-dark">{formatPrice(order.total_amount)}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[order.status] || ''}`}>{order.status}</span>
                      </div>
                    </div>
                  ))}
                  {orders.length === 0 && <p className="text-sm text-apple-gray text-center py-4">No orders yet</p>}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-apple-border">
                <h3 className="text-lg font-semibold text-apple-dark mb-4">Products by Category</h3>
                <div className="space-y-3">
                  {stats?.categoryCounts?.map(({ category, count }) => (
                    <div key={category} className="flex items-center justify-between p-3 bg-apple-light rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-apple-blue/10 rounded-lg flex items-center justify-center">
                          <Package className="w-4 h-4 text-apple-blue" />
                        </div>
                        <span className="text-sm font-medium text-apple-dark capitalize">{category}</span>
                      </div>
                      <span className="text-sm font-bold text-apple-dark">{count} products</span>
                    </div>
                  ))}
                  {(!stats?.categoryCounts || stats.categoryCounts.length === 0) && <p className="text-sm text-apple-gray text-center py-4">No data yet</p>}
                </div>
              </div>
            </div>
          </div>
        ) : activeTab === 'orders' ? (
          <div className="bg-white rounded-2xl border border-apple-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-apple-border bg-apple-light">
                    {['Order', 'Customer', 'Date', 'Total', 'Status', 'Payment', 'Actions'].map(h => (
                      <th key={h} className="text-left text-xs font-semibold text-apple-gray uppercase tracking-wider px-6 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-apple-border">
                  {orders.map(order => (
                    <tr key={order.id} className="hover:bg-apple-light/50 transition-colors">
                      <td className="px-6 py-4"><span className="text-sm font-semibold text-apple-dark">#{order.id}</span></td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-apple-dark">{order.customer_name}</p>
                        <p className="text-xs text-apple-gray">{order.customer_phone}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-apple-gray">{new Date(order.created_at).toLocaleDateString()}</td>
                      <td className="px-6 py-4"><span className="text-sm font-bold text-apple-dark">{formatPrice(order.total_amount)}</span></td>
                      <td className="px-6 py-4">
                        <select value={order.status} onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                          disabled={updatingOrder === order.id}
                          className={`text-xs px-2 py-1 rounded-full border-0 font-medium cursor-pointer focus:ring-2 focus:ring-apple-blue ${statusColors[order.status] || ''}`}>
                          <option value="pending">Pending</option><option value="processing">Processing</option>
                          <option value="shipped">Shipped</option><option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <select value={order.payment_status} onChange={(e) => handlePaymentUpdate(order.id, e.target.value)}
                          disabled={updatingOrder === order.id}
                          className={`text-xs px-2 py-1 rounded-full border-0 font-medium cursor-pointer focus:ring-2 focus:ring-apple-blue ${paymentColors[order.payment_status] || ''}`}>
                          <option value="pending">Pending</option><option value="paid">Paid</option>
                          <option value="failed">Failed</option><option value="refunded">Refunded</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">{updatingOrder === order.id && <Loader2 className="w-4 h-4 text-apple-blue animate-spin" />}</td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr><td colSpan={7} className="px-6 py-12 text-center">
                      <ShoppingCart className="w-10 h-10 text-apple-border mx-auto mb-3" />
                      <p className="text-sm text-apple-gray">No orders yet</p>
                    </td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
              <div className="relative flex-1 sm:max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-apple-gray" />
                <input type="text" value={productSearch} onChange={e => setProductSearch(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-apple-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-apple-blue" />
              </div>
              <button onClick={openAddModal}
                className="flex items-center gap-2 bg-apple-blue text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-apple-blue-hover transition-colors">
                <Plus className="w-4 h-4" /> Add Product
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-apple-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-apple-border bg-apple-light">
                      {['Product', 'Category', 'Price', 'Stock', 'Featured', 'Actions'].map(h => (
                        <th key={h} className="text-left text-xs font-semibold text-apple-gray uppercase tracking-wider px-6 py-3">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-apple-border">
                    {filteredProducts.map(product => (
                      <tr key={product.id} className="hover:bg-apple-light/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-apple-light rounded-lg flex items-center justify-center shrink-0">
                              <img src={getImageUrl(product.image)} alt={product.name} className="w-10 h-10 object-contain" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-apple-dark">{product.name}</p>
                              <p className="text-xs text-apple-gray">{product.model} &middot; {product.storage}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-apple-gray capitalize">{product.category}</td>
                        <td className="px-6 py-4"><span className="text-sm font-bold text-apple-dark">{formatPrice(product.price)}</span></td>
                        <td className="px-6 py-4">
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${product.stock > 5 ? 'bg-green-100 text-green-700' : product.stock > 0 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-600'}`}>
                            {product.stock}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button onClick={() => toggleFeatured(product)}
                            className={`p-1 rounded-full transition-colors ${product.featured ? 'text-amber-500 hover:text-amber-600' : 'text-apple-border hover:text-apple-gray'}`}>
                            <Star className={`w-5 h-5 ${product.featured ? 'fill-current' : ''}`} />
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1">
                            <button onClick={() => openEditModal(product)} className="p-2 rounded-lg hover:bg-apple-light transition-colors" title="Edit">
                              <Pencil className="w-4 h-4 text-apple-gray" />
                            </button>
                            {deleteConfirm === product.id ? (
                              <div className="flex items-center gap-1">
                                <button onClick={() => handleDeleteProduct(product.id)} className="text-xs text-red-600 font-medium px-2 py-1 rounded bg-red-50 hover:bg-red-100">Confirm</button>
                                <button onClick={() => setDeleteConfirm(null)} className="text-xs text-apple-gray font-medium px-2 py-1 rounded bg-apple-light hover:bg-apple-border/30">Cancel</button>
                              </div>
                            ) : (
                              <button onClick={() => setDeleteConfirm(product.id)} className="p-2 rounded-lg hover:bg-red-50 transition-colors" title="Delete">
                                <Trash2 className="w-4 h-4 text-apple-gray" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredProducts.length === 0 && (
                      <tr><td colSpan={6} className="px-6 py-12 text-center">
                        <Package className="w-10 h-10 text-apple-border mx-auto mb-3" />
                        <p className="text-sm text-apple-gray">{productSearch ? 'No matching products' : 'No products yet'}</p>
                      </td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {modalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setModalMode(null)} />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="relative bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-apple-border">
              <h2 className="text-lg font-semibold text-apple-dark">{modalMode === 'add' ? 'Add Product' : 'Edit Product'}</h2>
              <button onClick={() => setModalMode(null)} className="p-2 rounded-full hover:bg-apple-light"><X className="w-5 h-5 text-apple-gray" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-apple-dark mb-1">Name *</label>
                  <input value={editProduct.name} onChange={e => setEditProduct(p => ({ ...p, name: e.target.value }))}
                    className="w-full px-3 py-2 bg-apple-light border border-apple-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-apple-blue" placeholder="iPhone 17 Pro Max" />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-apple-dark mb-1">Model *</label>
                  <input value={editProduct.model} onChange={e => setEditProduct(p => ({ ...p, model: e.target.value }))}
                    className="w-full px-3 py-2 bg-apple-light border border-apple-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-apple-blue" placeholder="iPhone 17 Pro Max" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-apple-dark mb-1">Storage</label>
                  <input value={editProduct.storage} onChange={e => setEditProduct(p => ({ ...p, storage: e.target.value }))}
                    className="w-full px-3 py-2 bg-apple-light border border-apple-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-apple-blue" placeholder="256GB" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-apple-dark mb-1">Price ($) *</label>
                  <input type="number" value={editProduct.price || ''} onChange={e => setEditProduct(p => ({ ...p, price: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 bg-apple-light border border-apple-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-apple-blue" placeholder="0" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-apple-dark mb-1">Category</label>
                  <select value={editProduct.category} onChange={e => setEditProduct(p => ({ ...p, category: e.target.value }))}
                    className="w-full px-3 py-2 bg-apple-light border border-apple-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-apple-blue">
                    <option value="iphones">iPhones</option><option value="accessories">Accessories</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-apple-dark mb-1">Stock *</label>
                  <input type="number" value={editProduct.stock || ''} onChange={e => setEditProduct(p => ({ ...p, stock: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 bg-apple-light border border-apple-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-apple-blue" placeholder="0" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-apple-dark mb-1">Colors (comma-separated)</label>
                <input value={editProduct.colors} onChange={e => setEditProduct(p => ({ ...p, colors: e.target.value }))}
                  className="w-full px-3 py-2 bg-apple-light border border-apple-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-apple-blue" placeholder="Black,White,Blue" />
              </div>
              <div>
                <label className="block text-sm font-medium text-apple-dark mb-1">Description</label>
                <textarea value={editProduct.description} onChange={e => setEditProduct(p => ({ ...p, description: e.target.value }))} rows={3}
                  className="w-full px-3 py-2 bg-apple-light border border-apple-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-apple-blue resize-none" placeholder="Product description..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-apple-dark mb-1">Product Image</label>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 px-4 py-2 bg-apple-light border border-apple-border rounded-xl text-sm cursor-pointer hover:bg-apple-border/20 transition-colors">
                    <Upload className="w-4 h-4 text-apple-gray" />
                    {uploading ? 'Uploading...' : 'Upload Image'}
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
                  </label>
                  {editProduct.image && (
                    <div className="w-12 h-12 bg-apple-light rounded-lg flex items-center justify-center">
                      <img src={getImageUrl(editProduct.image)} alt="Preview" className="w-10 h-10 object-contain" />
                    </div>
                  )}
                </div>
                <input value={editProduct.image} onChange={e => setEditProduct(p => ({ ...p, image: e.target.value }))}
                  className="w-full mt-2 px-3 py-2 bg-apple-light border border-apple-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-apple-blue" placeholder="Or paste image URL" />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={editProduct.featured} onChange={e => setEditProduct(p => ({ ...p, featured: e.target.checked }))}
                  className="w-4 h-4 rounded border-apple-border text-apple-blue focus:ring-apple-blue" />
                <span className="text-sm font-medium text-apple-dark">Featured product</span>
              </label>
            </div>
            <div className="flex items-center justify-end gap-3 p-6 border-t border-apple-border">
              <button onClick={() => setModalMode(null)} className="px-5 py-2.5 text-sm font-medium text-apple-gray hover:text-apple-dark transition-colors">Cancel</button>
              <button onClick={handleSaveProduct} disabled={saving || !editProduct.name || !editProduct.model}
                className="flex items-center gap-2 bg-apple-blue text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-apple-blue-hover transition-colors disabled:opacity-50">
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {modalMode === 'add' ? 'Add Product' : 'Save Changes'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
