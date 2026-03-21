import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/helpers';
import Button from '../components/Button';

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, cartTotal, cartCount } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-24 flex flex-col items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <div className="w-20 h-20 rounded-2xl bg-dark-700 border border-blue-500/10 flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-200 mb-2">Your cart is empty</h2>
          <p className="text-sm text-slate-500 mb-6">Looks like you haven't added any items yet</p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 h-11 px-6 rounded-xl bg-gradient-to-r from-accent-blue to-blue-500 text-white text-sm font-semibold"
          >
            Start Shopping
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
          </Link>
        </motion.div>
      </div>
    );
  }

  const shipping = cartTotal >= 100 ? 0 : 9.99;
  const tax = cartTotal * 0.08;
  const total = cartTotal + shipping + tax;

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500 mb-2">
            <Link to="/" className="hover:text-slate-300">HOME</Link>
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 5l7 7-7 7" /></svg>
            <span className="text-accent-blue">CART</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-8">Shopping Cart <span className="text-slate-500 text-lg font-normal">({cartCount} items)</span></h1>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100, height: 0 }}
                  className="flex gap-4 p-4 bg-dark-700 rounded-2xl border border-blue-500/10"
                >
                  <Link to={`/product/${item.id}`} className="shrink-0">
                    <img src={item.image} alt={item.name} className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl object-cover" />
                  </Link>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <p className="text-xs font-mono text-accent-blue mb-1">{item.category}</p>
                        <Link to={`/product/${item.id}`} className="text-sm sm:text-base font-semibold text-slate-200 hover:text-accent-cyan transition-colors line-clamp-2">
                          {item.name}
                        </Link>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>

                    <div className="flex items-end justify-between mt-3">
                      <div className="flex items-center h-9 rounded-lg bg-dark-800 border border-blue-500/10 overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-9 h-full flex items-center justify-center text-slate-400 hover:text-slate-200 hover:bg-dark-600 transition-all"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M20 12H4" /></svg>
                        </button>
                        <span className="w-9 text-center text-sm font-mono font-medium text-slate-200">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-9 h-full flex items-center justify-center text-slate-400 hover:text-slate-200 hover:bg-dark-600 transition-all"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M12 4v16m8-8H4" /></svg>
                        </button>
                      </div>
                      <span className="text-lg font-bold text-slate-100">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="sticky top-24 bg-dark-700 rounded-2xl border border-blue-500/10 p-6">
              <h3 className="text-lg font-semibold mb-4">Order Summary</h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal ({cartCount} items)</span>
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

              {shipping > 0 && (
                <p className="text-xs text-slate-500 mt-3">
                  Add {formatPrice(100 - cartTotal)} more for free shipping
                </p>
              )}

              <Button
                onClick={() => navigate(isAuthenticated ? '/checkout' : '/login')}
                className="w-full mt-6"
                size="lg"
              >
                {isAuthenticated ? 'Proceed to Checkout' : 'Sign in to Checkout'}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </Button>

              <Link to="/products" className="block text-center text-sm text-slate-500 hover:text-accent-blue mt-3 transition-colors">
                Continue Shopping
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
