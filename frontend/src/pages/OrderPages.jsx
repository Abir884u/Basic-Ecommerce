import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ordersAPI } from '../api';

const STATUS_COLORS = {
  pending: 'bg-yellow-950 text-yellow-400',
  confirmed: 'bg-blue-950 text-blue-400',
  processing: 'bg-purple-950 text-purple-400',
  shipped: 'bg-indigo-950 text-indigo-400',
  delivered: 'bg-green-950 text-green-400',
  cancelled: 'bg-red-950 text-red-400',
};

export function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ordersAPI.getMyOrders()
      .then(({ data }) => setOrders(data.orders))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen max-w-4xl mx-auto px-4 py-8">
        <h1 className="section-title mb-6">My Orders</h1>
        {Array(3).fill(0).map((_, i) => (
          <div key={i} className="card p-6 mb-4">
            <div className="h-5 w-40 shimmer-box rounded mb-3" />
            <div className="h-4 w-full shimmer-box rounded mb-2" />
            <div className="h-4 w-2/3 shimmer-box rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="section-title mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-5xl mb-4">📦</p>
          <h3 className="font-display text-xl font-bold text-white mb-2">No orders yet</h3>
          <p className="text-surface-300 mb-6">Start shopping and your orders will appear here.</p>
          <Link to="/products" className="btn-primary">Shop Now</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order._id} className="card p-5 hover:border-brand-700 transition-all">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <div>
                  <p className="text-xs text-surface-300 mb-1">Order #{order._id.slice(-8).toUpperCase()}</p>
                  <p className="text-sm text-surface-300">
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'long', day: 'numeric'
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`badge py-1 px-3 capitalize ${STATUS_COLORS[order.status]}`}>
                    {order.status}
                  </span>
                  <span className="text-lg font-bold text-white">${order.totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 mb-4">
                {order.items.slice(0, 4).map((item, i) => (
                  <img
                    key={i}
                    src={item.image || 'https://via.placeholder.com/50'}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded-lg border border-ink-700"
                  />
                ))}
                {order.items.length > 4 && (
                  <span className="text-sm text-surface-300">+{order.items.length - 4} more</span>
                )}
              </div>

              <Link to={`/orders/${order._id}`} className="btn-secondary text-sm py-2">
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ordersAPI.getById(id)
      .then(({ data }) => setOrder(data.order))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen max-w-4xl mx-auto px-4 py-8">
        <div className="h-8 w-48 shimmer-box rounded mb-6" />
        <div className="grid md:grid-cols-2 gap-6">
          <div className="card p-6 h-48 shimmer-box" />
          <div className="card p-6 h-48 shimmer-box" />
        </div>
      </div>
    );
  }

  if (!order) return <div className="text-center py-20 text-surface-300">Order not found</div>;

  return (
    <div className="min-h-screen max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link to="/orders" className="text-sm text-surface-300 hover:text-white mb-2 block transition-colors">
            ← Back to Orders
          </Link>
          <h1 className="font-display text-2xl font-bold text-white">
            Order #{order._id.slice(-8).toUpperCase()}
          </h1>
        </div>
        <span className={`badge py-1.5 px-4 capitalize text-sm ${STATUS_COLORS[order.status]}`}>
          {order.status}
        </span>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Shipping Address */}
        <div className="card p-5">
          <h3 className="font-semibold text-white mb-3">Shipping Address</h3>
          <div className="text-sm text-surface-300 space-y-1">
            <p className="text-white font-medium">{order.shippingAddress.fullName}</p>
            <p>{order.shippingAddress.street}</p>
            <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
            <p>{order.shippingAddress.country}</p>
            <p>{order.shippingAddress.phone}</p>
          </div>
        </div>

        {/* Payment & Summary */}
        <div className="card p-5">
          <h3 className="font-semibold text-white mb-3">Order Summary</h3>
          <div className="text-sm space-y-2">
            <div className="flex justify-between text-surface-300">
              <span>Payment Method</span>
              <span className="text-white">{order.paymentMethod}</span>
            </div>
            <div className="flex justify-between text-surface-300">
              <span>Subtotal</span>
              <span className="text-white">${order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-surface-300">
              <span>Shipping</span>
              <span className={order.shippingCost === 0 ? 'text-green-400' : 'text-white'}>
                {order.shippingCost === 0 ? 'FREE' : `$${order.shippingCost.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between text-surface-300">
              <span>Tax</span>
              <span className="text-white">${order.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-base border-t border-ink-700 pt-2 mt-1">
              <span className="text-white">Total</span>
              <span className="text-white">${order.totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="card p-5">
        <h3 className="font-semibold text-white mb-4">Items Ordered</h3>
        <div className="space-y-3">
          {order.items.map((item, i) => (
            <div key={i} className="flex items-center gap-4 p-3 bg-ink-700 rounded-xl">
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 object-cover rounded-lg"
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-white">{item.name}</p>
                <p className="text-sm text-surface-300">Qty: {item.quantity} × ${item.price.toFixed(2)}</p>
              </div>
              <p className="font-bold text-white">${(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>

      {order.trackingNumber && (
        <div className="mt-4 p-4 card text-sm">
          <p className="text-surface-300">Tracking Number: <span className="font-mono text-brand-400">{order.trackingNumber}</span></p>
        </div>
      )}
    </div>
  );
}
