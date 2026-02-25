import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { productsAPI, ordersAPI, usersAPI } from '../api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const STATUS_COLORS = {
  pending: 'bg-yellow-950 text-yellow-400',
  confirmed: 'bg-blue-950 text-blue-400',
  processing: 'bg-purple-950 text-purple-400',
  shipped: 'bg-indigo-950 text-indigo-400',
  delivered: 'bg-green-950 text-green-400',
  cancelled: 'bg-red-950 text-red-400',
};

export default function AdminPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('dashboard');
  const [stats, setStats] = useState({ orders: 0, products: 0, users: 0, revenue: 0 });
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Redirect if not admin
  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [prodRes, orderRes, userRes] = await Promise.all([
        productsAPI.getAll({ limit: 100 }),
        ordersAPI.getAllAdmin({ limit: 50 }),
        usersAPI.getAll(),
      ]);

      setProducts(prodRes.data.products);
      setOrders(orderRes.data.orders);

      const revenue = orderRes.data.orders.reduce((sum, o) => sum + o.totalPrice, 0);
      setStats({
        products: prodRes.data.total,
        orders: orderRes.data.total,
        users: userRes.data.total,
        revenue,
      });
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await productsAPI.delete(id);
      setProducts(prev => prev.filter(p => p._id !== id));
      toast.success('Product deleted');
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      await ordersAPI.updateStatus(orderId, { status });
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status } : o));
      toast.success('Order status updated');
    } catch (error) {
      toast.error('Failed to update order');
    }
  };

  const TABS = ['dashboard', 'products', 'orders'];

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="section-title">Admin Dashboard</h1>
        <span className="badge bg-brand-950 text-brand-400 border border-brand-800 py-1 px-3">
          ⚙ Admin Panel
        </span>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-ink-800 border border-ink-700 rounded-xl p-1 w-fit">
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all capitalize
              ${tab === t ? 'bg-brand-600 text-white' : 'text-surface-300 hover:text-white'}`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Dashboard Tab */}
      {tab === 'dashboard' && (
        <div className="animate-fade-in">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Revenue', value: `$${stats.revenue.toFixed(0)}`, icon: '💰', color: 'text-green-400' },
              { label: 'Total Orders', value: stats.orders, icon: '📦', color: 'text-blue-400' },
              { label: 'Products', value: stats.products, icon: '🏷️', color: 'text-purple-400' },
              { label: 'Users', value: stats.users, icon: '👥', color: 'text-orange-400' },
            ].map(stat => (
              <div key={stat.label} className="card p-5">
                <p className="text-2xl mb-2">{stat.icon}</p>
                <p className={`font-display text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-sm text-surface-300">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Recent Orders */}
          <div className="card">
            <div className="p-5 border-b border-ink-700">
              <h3 className="font-semibold text-white">Recent Orders</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-ink-700">
                    <th className="text-left text-surface-300 font-medium px-5 py-3">Order</th>
                    <th className="text-left text-surface-300 font-medium px-5 py-3">Customer</th>
                    <th className="text-left text-surface-300 font-medium px-5 py-3">Amount</th>
                    <th className="text-left text-surface-300 font-medium px-5 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 8).map(order => (
                    <tr key={order._id} className="border-b border-ink-700 hover:bg-ink-700 transition-colors">
                      <td className="px-5 py-3 font-mono text-xs text-surface-300">
                        #{order._id.slice(-8).toUpperCase()}
                      </td>
                      <td className="px-5 py-3 text-white">{order.user?.name || 'N/A'}</td>
                      <td className="px-5 py-3 font-medium text-white">${order.totalPrice.toFixed(2)}</td>
                      <td className="px-5 py-3">
                        <span className={`badge py-1 px-2.5 capitalize ${STATUS_COLORS[order.status]}`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Products Tab */}
      {tab === 'products' && (
        <div className="animate-fade-in">
          <div className="flex justify-end mb-4">
            <Link to="/admin/products/new" className="btn-primary text-sm py-2">
              + Add Product
            </Link>
          </div>
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-ink-700 bg-ink-700">
                    <th className="text-left text-surface-300 font-medium px-5 py-3">Product</th>
                    <th className="text-left text-surface-300 font-medium px-5 py-3">Category</th>
                    <th className="text-left text-surface-300 font-medium px-5 py-3">Price</th>
                    <th className="text-left text-surface-300 font-medium px-5 py-3">Stock</th>
                    <th className="text-left text-surface-300 font-medium px-5 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <tr key={product._id} className="border-b border-ink-700 hover:bg-ink-700 transition-colors">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.images?.[0] || 'https://via.placeholder.com/40'}
                            alt={product.name}
                            className="w-10 h-10 object-cover rounded-lg"
                          />
                          <span className="text-white font-medium line-clamp-1 max-w-[200px]">{product.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-surface-300">{product.category}</td>
                      <td className="px-5 py-3 text-white font-medium">${product.price.toFixed(2)}</td>
                      <td className="px-5 py-3">
                        <span className={`font-medium ${product.stock === 0 ? 'text-red-400' : product.stock <= 10 ? 'text-orange-400' : 'text-green-400'}`}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex gap-2">
                          <Link to={`/products/${product._id}`} className="text-xs text-brand-400 hover:text-brand-300">
                            View
                          </Link>
                          <button
                            onClick={() => handleDeleteProduct(product._id)}
                            className="text-xs text-red-400 hover:text-red-300"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {tab === 'orders' && (
        <div className="animate-fade-in">
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-ink-700 bg-ink-700">
                    <th className="text-left text-surface-300 font-medium px-5 py-3">Order</th>
                    <th className="text-left text-surface-300 font-medium px-5 py-3">Customer</th>
                    <th className="text-left text-surface-300 font-medium px-5 py-3">Date</th>
                    <th className="text-left text-surface-300 font-medium px-5 py-3">Amount</th>
                    <th className="text-left text-surface-300 font-medium px-5 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order._id} className="border-b border-ink-700 hover:bg-ink-700 transition-colors">
                      <td className="px-5 py-3 font-mono text-xs text-surface-300">
                        #{order._id.slice(-8).toUpperCase()}
                      </td>
                      <td className="px-5 py-3 text-white">{order.user?.name || 'N/A'}</td>
                      <td className="px-5 py-3 text-surface-300">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-3 font-medium text-white">${order.totalPrice.toFixed(2)}</td>
                      <td className="px-5 py-3">
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                          className="bg-ink-700 border border-ink-600 text-surface-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-brand-600"
                        >
                          {['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => (
                            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
