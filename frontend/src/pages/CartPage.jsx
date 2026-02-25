import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const TrashIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, subtotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const shippingCost = subtotal > 50 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shippingCost + tax;

  if (items.length === 0) {
    return (
      <div className="min-h-screen max-w-7xl mx-auto px-4 py-8 flex flex-col items-center justify-center text-center">
        <p className="text-7xl mb-6">🛒</p>
        <h2 className="font-display text-3xl font-bold text-white mb-3">Your cart is empty</h2>
        <p className="text-surface-300 mb-8">Discover amazing products and add them to your cart.</p>
        <Link to="/products" className="btn-primary text-base py-3 px-8">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="section-title">Your Cart ({items.length} items)</h1>
        <button
          onClick={clearCart}
          className="text-sm text-red-400 hover:text-red-300 transition-colors"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map(item => (
            <div key={item._id} className="card p-4 flex gap-4">
              <Link to={`/products/${item._id}`} className="flex-shrink-0">
                <img
                  src={item.images?.[0] || 'https://via.placeholder.com/100x100'}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded-lg"
                />
              </Link>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Link
                      to={`/products/${item._id}`}
                      className="font-medium text-white hover:text-brand-300 transition-colors line-clamp-1"
                    >
                      {item.name}
                    </Link>
                    <p className="text-sm text-surface-300 mt-0.5">{item.category}</p>
                  </div>
                  <button
                    onClick={() => removeItem(item._id)}
                    className="text-ink-600 hover:text-red-400 transition-colors flex-shrink-0"
                  >
                    <TrashIcon />
                  </button>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center bg-ink-700 border border-ink-600 rounded-lg overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      className="px-3 py-1.5 text-surface-300 hover:text-white hover:bg-ink-600 transition-colors"
                    >
                      −
                    </button>
                    <span className="px-4 py-1.5 text-white font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      disabled={item.quantity >= item.stock}
                      className="px-3 py-1.5 text-surface-300 hover:text-white hover:bg-ink-600 transition-colors disabled:opacity-40"
                    >
                      +
                    </button>
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-white">${(item.price * item.quantity).toFixed(2)}</p>
                    <p className="text-xs text-surface-300">${item.price.toFixed(2)} each</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-24">
            <h2 className="font-display text-xl font-bold text-white mb-6">Order Summary</h2>

            <div className="space-y-3 text-sm mb-6">
              <div className="flex justify-between text-surface-300">
                <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                <span className="text-white">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-surface-300">
                <span>Shipping</span>
                <span className={shippingCost === 0 ? 'text-green-400' : 'text-white'}>
                  {shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-surface-300">
                <span>Tax (8%)</span>
                <span className="text-white">${tax.toFixed(2)}</span>
              </div>

              {shippingCost > 0 && (
                <p className="text-xs text-brand-400 bg-brand-950 rounded-lg px-3 py-2">
                  Add ${(50 - subtotal).toFixed(2)} more for free shipping!
                </p>
              )}

              <div className="border-t border-ink-700 pt-3 flex justify-between font-bold text-base">
                <span className="text-white">Total</span>
                <span className="text-white">${total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => navigate(user ? '/checkout' : '/login?redirect=/checkout')}
              className="btn-primary w-full py-3.5 text-base"
            >
              {user ? 'Proceed to Checkout' : 'Login to Checkout'}
            </button>

            <Link to="/products" className="btn-ghost w-full mt-3 text-sm justify-center">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
