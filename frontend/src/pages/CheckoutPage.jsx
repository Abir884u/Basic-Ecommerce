import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ordersAPI } from '../api';
import toast from 'react-hot-toast';

const STEPS = ['Shipping', 'Payment', 'Review'];

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const shippingCost = subtotal > 50 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shippingCost + tax;

  const [shippingForm, setShippingForm] = useState({
    fullName: user?.name || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zipCode: user?.address?.zipCode || '',
    country: user?.address?.country || 'Bangladesh',
    phone: user?.phone || '',
  });

  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    setStep(1);
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const orderItems = items.map(item => ({
        product: item._id,
        quantity: item.quantity
      }));

      const { data } = await ordersAPI.create({
        items: orderItems,
        shippingAddress: shippingForm,
        paymentMethod,
      });

      clearCart();
      toast.success('Order placed successfully!', {
        style: { background: '#1e1e2e', color: '#f0ecfa', border: '1px solid #2d2d42' }
      });
      navigate(`/orders/${data.order._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <p className="text-5xl mb-4">🛒</p>
        <h2 className="font-display text-2xl font-bold text-white mb-2">Cart is empty</h2>
        <Link to="/products" className="btn-primary mt-4">Shop Now</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="section-title mb-8">Checkout</h1>

      {/* Stepper */}
      <div className="flex items-center justify-center mb-8">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all
              ${i === step ? 'bg-brand-600 text-white' : i < step ? 'bg-brand-950 text-brand-400' : 'text-ink-600'}`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs
                ${i === step ? 'bg-white text-brand-600' : i < step ? 'bg-brand-500 text-white' : 'bg-ink-700 text-surface-300'}`}
              >
                {i < step ? '✓' : i + 1}
              </span>
              {s}
            </div>
            {i < STEPS.length - 1 && (
              <div className={`w-12 h-px mx-1 ${i < step ? 'bg-brand-600' : 'bg-ink-700'}`} />
            )}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Step 0: Shipping */}
          {step === 0 && (
            <div className="card p-6 animate-slide-up">
              <h2 className="font-display text-xl font-bold text-white mb-6">Shipping Address</h2>
              <form onSubmit={handleShippingSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-surface-300 mb-1.5">Full Name</label>
                    <input
                      required
                      value={shippingForm.fullName}
                      onChange={(e) => setShippingForm(f => ({ ...f, fullName: e.target.value }))}
                      className="input-field"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-surface-300 mb-1.5">Phone</label>
                    <input
                      required
                      value={shippingForm.phone}
                      onChange={(e) => setShippingForm(f => ({ ...f, phone: e.target.value }))}
                      className="input-field"
                      placeholder="+880 1XXXXXXXXX"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-surface-300 mb-1.5">Street Address</label>
                  <input
                    required
                    value={shippingForm.street}
                    onChange={(e) => setShippingForm(f => ({ ...f, street: e.target.value }))}
                    className="input-field"
                    placeholder="123 Main Street"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-surface-300 mb-1.5">City</label>
                    <input
                      required
                      value={shippingForm.city}
                      onChange={(e) => setShippingForm(f => ({ ...f, city: e.target.value }))}
                      className="input-field"
                      placeholder="Dhaka"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-surface-300 mb-1.5">State / Division</label>
                    <input
                      required
                      value={shippingForm.state}
                      onChange={(e) => setShippingForm(f => ({ ...f, state: e.target.value }))}
                      className="input-field"
                      placeholder="Dhaka Division"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-surface-300 mb-1.5">ZIP / Postal Code</label>
                    <input
                      required
                      value={shippingForm.zipCode}
                      onChange={(e) => setShippingForm(f => ({ ...f, zipCode: e.target.value }))}
                      className="input-field"
                      placeholder="1200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-surface-300 mb-1.5">Country</label>
                    <input
                      required
                      value={shippingForm.country}
                      onChange={(e) => setShippingForm(f => ({ ...f, country: e.target.value }))}
                      className="input-field"
                      placeholder="Bangladesh"
                    />
                  </div>
                </div>

                <button type="submit" className="btn-primary w-full py-3">
                  Continue to Payment
                </button>
              </form>
            </div>
          )}

          {/* Step 1: Payment */}
          {step === 1 && (
            <div className="card p-6 animate-slide-up">
              <h2 className="font-display text-xl font-bold text-white mb-6">Payment Method</h2>
              <div className="space-y-3 mb-6">
                {['Cash on Delivery', 'Credit Card', 'Debit Card', 'PayPal'].map(method => (
                  <label key={method} className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all
                    ${paymentMethod === method ? 'border-brand-600 bg-brand-950' : 'border-ink-700 hover:border-ink-500'}`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={method}
                      checked={paymentMethod === method}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="accent-brand-500"
                    />
                    <div>
                      <p className="font-medium text-white">{method}</p>
                      {method === 'Cash on Delivery' && (
                        <p className="text-xs text-surface-300">Pay when your order arrives</p>
                      )}
                    </div>
                  </label>
                ))}
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(0)} className="btn-secondary flex-1 py-3">
                  Back
                </button>
                <button onClick={() => setStep(2)} className="btn-primary flex-1 py-3">
                  Review Order
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Review */}
          {step === 2 && (
            <div className="card p-6 animate-slide-up">
              <h2 className="font-display text-xl font-bold text-white mb-6">Review Your Order</h2>

              {/* Items */}
              <div className="space-y-3 mb-6">
                {items.map(item => (
                  <div key={item._id} className="flex items-center gap-3 p-3 bg-ink-700 rounded-lg">
                    <img
                      src={item.images?.[0] || 'https://via.placeholder.com/60'}
                      alt={item.name}
                      className="w-14 h-14 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white line-clamp-1">{item.name}</p>
                      <p className="text-xs text-surface-300">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-bold text-white">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              {/* Shipping Info */}
              <div className="p-4 bg-ink-700 rounded-xl mb-6 text-sm">
                <p className="font-medium text-white mb-1">Shipping to:</p>
                <p className="text-surface-300">
                  {shippingForm.fullName} • {shippingForm.phone}<br />
                  {shippingForm.street}, {shippingForm.city}, {shippingForm.state} {shippingForm.zipCode}, {shippingForm.country}
                </p>
                <p className="font-medium text-white mt-3 mb-1">Payment:</p>
                <p className="text-surface-300">{paymentMethod}</p>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="btn-secondary flex-1 py-3">
                  Back
                </button>
                <button
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  className="btn-primary flex-1 py-3"
                >
                  {loading ? 'Placing Order...' : `Place Order — $${total.toFixed(2)}`}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-24">
            <h3 className="font-semibold text-white mb-4">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-surface-300">
                <span>Subtotal</span>
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
              <div className="border-t border-ink-700 pt-2 flex justify-between font-bold">
                <span className="text-white">Total</span>
                <span className="text-white">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
