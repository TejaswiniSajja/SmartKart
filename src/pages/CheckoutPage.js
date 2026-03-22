import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/helpers';
import Button from '../components/Button';
import Modal from '../components/Modal';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const { items, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [orderModal, setOrderModal] = useState(false);
  const [orderData, setOrderData] = useState(null);

  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    address: '',
    city: '',
    state: '',
    zip: '',
    payment: 'card',
  });

  const [errors, setErrors] = useState({});

  const shipping = cartTotal >= 100 ? 0 : 9.99;
  const tax = cartTotal * 0.08;
  const total = cartTotal + shipping + tax;

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    if (!form.address.trim()) errs.address = 'Address is required';
    if (!form.city.trim()) errs.city = 'City is required';
    if (!form.state.trim()) errs.state = 'State is required';
    if (!form.zip.trim()) errs.zip = 'ZIP code is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await api.placeOrder({ ...form, items, total });
      setOrderData(res.data);
      setOrderModal(true);
      clearCart();
    } catch (err) {
      toast.error('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
  };

  if (items.length === 0 && !orderModal) {
    return (
      <div className="min-h-screen pt-24 flex flex-col items-center justify-center px-4">
        <div className="w-16 h-16 rounded-2xl bg-dark-700 flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-slate-200 mb-2">Nothing to checkout</h2>
        <Link to="/products" className="text-sm text-accent-blue hover:underline">Browse products</Link>
      </div>
    );
  }

  const inputClass = (field) =>
    `w-full bg-dark-800 border ${errors[field] ? 'border-red-500/50' : 'border-blue-500/15'} rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-500 transition-all`;

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500 mb-2">
            <Link to="/" className="hover:text-slate-300">HOME</Link>
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 5l7 7-7 7" /></svg>
            <Link to="/cart" className="hover:text-slate-300">CART</Link>
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 5l7 7-7 7" /></svg>
            <span className="text-accent-blue">CHECKOUT</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-8">Checkout</h1>
        </motion.div>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-dark-700 rounded-2xl border border-blue-500/10 p-6"
              >
                <h3 className="text-base font-semibold mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-accent-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Shipping Address
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1.5">Full Name</label>
                    <input type="text" value={form.name} onChange={handleChange('name')} placeholder="John Doe" className={inputClass('name')} />
                    {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1.5">Email</label>
                    <input type="email" value={form.email} onChange={handleChange('email')} placeholder="john@example.com" className={inputClass('email')} />
                    {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs text-slate-400 mb-1.5">Street Address</label>
                    <input type="text" value={form.address} onChange={handleChange('address')} placeholder="123 Main Street, Apt 4" className={inputClass('address')} />
                    {errors.address && <p className="text-xs text-red-400 mt-1">{errors.address}</p>}
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1.5">City</label>
                    <input type="text" value={form.city} onChange={handleChange('city')} placeholder="San Francisco" className={inputClass('city')} />
                    {errors.city && <p className="text-xs text-red-400 mt-1">{errors.city}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1.5">State</label>
                      <input type="text" value={form.state} onChange={handleChange('state')} placeholder="CA" className={inputClass('state')} />
                      {errors.state && <p className="text-xs text-red-400 mt-1">{errors.state}</p>}
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1.5">ZIP Code</label>
                      <input type="text" value={form.zip} onChange={handleChange('zip')} placeholder="94102" className={inputClass('zip')} />
                      {errors.zip && <p className="text-xs text-red-400 mt-1">{errors.zip}</p>}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Payment */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-dark-700 rounded-2xl border border-blue-500/10 p-6"
              >
                <h3 className="text-base font-semibold mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-accent-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  Payment Method
                </h3>
                <div className="grid sm:grid-cols-3 gap-3">
                  {[
                    { value: 'card', label: 'Credit Card', icon: '💳' },
                    { value: 'upi', label: 'UPI', icon: '📱' },
                    { value: 'cod', label: 'Cash on Delivery', icon: '💵' },
                  ].map(method => (
                    <button
                      key={method.value}
                      type="button"
                      onClick={() => setForm(prev => ({ ...prev, payment: method.value }))}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        form.payment === method.value
                          ? 'bg-accent-blue/10 border-accent-blue/40 shadow-glow'
                          : 'bg-dark-800 border-blue-500/10 hover:border-blue-500/25'
                      }`}
                    >
                      <span className="text-2xl block mb-2">{method.icon}</span>
                      <span className="text-sm font-medium text-slate-200">{method.label}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="sticky top-24 bg-dark-700 rounded-2xl border border-blue-500/10 p-6">
                <h3 className="text-base font-semibold mb-4">Order Summary</h3>

                <div className="space-y-3 max-h-60 overflow-y-auto mb-4">
                  {items.map(item => (
                    <div key={item.id} className="flex items-center gap-3">
                      <img src={item.image} alt="" className="w-12 h-12 rounded-lg object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-300 truncate">{item.name}</p>
                        <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                      </div>
                      <span className="text-sm font-medium text-slate-200">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-blue-500/10 pt-4 space-y-2 text-sm">
                  <div className="flex justify-between text-slate-400">
                    <span>Subtotal</span>
                    <span className="text-slate-200">{formatPrice(cartTotal)}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? 'text-green-400' : 'text-slate-200'}>
                      {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Tax</span>
                    <span className="text-slate-200">{formatPrice(tax)}</span>
                  </div>
                  <div className="border-t border-blue-500/10 pt-3 flex justify-between">
                    <span className="font-semibold text-slate-200">Total</span>
                    <span className="text-xl font-bold text-gradient">{formatPrice(total)}</span>
                  </div>
                </div>

                <Button type="submit" className="w-full mt-6" size="lg" loading={loading}>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Place Secure Order
                </Button>

                <div className="flex items-center gap-1.5 justify-center mt-3 text-xs text-slate-500">
                  <svg className="w-3.5 h-3.5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  256-bit SSL encrypted
                </div>
              </div>
            </motion.div>
          </div>
        </form>

        {/* Order Confirmation Modal */}
        <Modal isOpen={orderModal} onClose={() => { setOrderModal(false); navigate('/'); }} title="Order Confirmed!">
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-full bg-green-500/15 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-200 mb-2">Thank you for your order!</h3>
            {orderData && (
              <div className="space-y-2 text-sm text-slate-400 mb-6">
                <p>Order ID: <span className="font-mono text-accent-cyan">{orderData.orderId}</span></p>
                <p>Estimated Delivery: <span className="text-slate-200">{orderData.estimatedDelivery}</span></p>
              </div>
            )}
            <Button onClick={() => { setOrderModal(false); navigate('/'); }} className="w-full">
              Continue Shopping
            </Button>
          </div>
        </Modal>
      </div>
    </div>
  );
}
