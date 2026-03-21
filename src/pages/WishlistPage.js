import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';

export default function WishlistPage() {
  const { wishlist } = useCart();

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500 mb-2">
            <Link to="/" className="hover:text-slate-300">HOME</Link>
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 5l7 7-7 7" /></svg>
            <span className="text-pink-400">WISHLIST</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-8">
            Wishlist <span className="text-slate-500 text-lg font-normal">({wishlist.length} items)</span>
          </h1>
        </motion.div>

        {wishlist.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-dark-700 border border-blue-500/10 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-300 mb-2">Your wishlist is empty</h3>
            <p className="text-sm text-slate-500 mb-4">Save items you love by clicking the heart icon</p>
            <Link to="/products" className="text-sm text-accent-blue hover:underline">Browse Products</Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {wishlist.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
