import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice, calcDiscount, getStars } from '../utils/helpers';
import toast from 'react-hot-toast';

export default function ProductCard({ product, index = 0 }) {
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const discount = calcDiscount(product.originalPrice, product.price);
  const stars = getStars(product.rating);
  const wishlisted = isInWishlist(product.id);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product);
    toast.success(`${product.name.split(' ').slice(0, 3).join(' ')} added to cart`, {
      style: { background: '#1a2236', color: '#f1f5f9', border: '1px solid rgba(56,130,246,0.2)' },
      iconTheme: { primary: '#3882f6', secondary: '#f1f5f9' },
    });
  };

  const handleWishlist = (e) => {
    e.stopPropagation();
    toggleWishlist(product);
    toast(wishlisted ? 'Removed from wishlist' : 'Added to wishlist', {
      icon: wishlisted ? '💔' : '❤️',
      style: { background: '#1a2236', color: '#f1f5f9', border: '1px solid rgba(56,130,246,0.2)' },
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      onClick={() => navigate(`/product/${product.id}`)}
      className="group relative bg-dark-700 rounded-2xl border border-blue-500/10 hover:border-blue-500/30 overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-glow"
    >
      {/* Discount badge */}
      {discount > 0 && (
        <div className="absolute top-3 left-3 z-10 bg-gradient-to-r from-accent-blue to-accent-cyan text-white text-xs font-bold px-2.5 py-1 rounded-lg">
          -{discount}%
        </div>
      )}

      {/* Wishlist button */}
      <button
        onClick={handleWishlist}
        className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-dark-800/80 backdrop-blur-sm flex items-center justify-center border border-blue-500/20 hover:border-pink-500/40 transition-all"
      >
        <svg className={`w-4 h-4 ${wishlisted ? 'text-pink-500 fill-pink-500' : 'text-slate-400'}`} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill={wishlisted ? 'currentColor' : 'none'}>
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      </button>

      {/* Image */}
      <div className="relative h-52 overflow-hidden bg-dark-800">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-700 via-transparent to-transparent opacity-60" />
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-xs text-accent-blue font-mono font-medium mb-1 tracking-wider uppercase">{product.category}</p>
        <h3 className="text-sm font-semibold text-slate-100 mb-2 line-clamp-2 group-hover:text-accent-cyan transition-colors leading-snug">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex gap-0.5">
            {[...Array(stars.full)].map((_, i) => (
              <svg key={`f${i}`} className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
            ))}
            {stars.half > 0 && (
              <svg className="w-3.5 h-3.5 text-yellow-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77V2z" fill="currentColor" /></svg>
            )}
            {[...Array(stars.empty)].map((_, i) => (
              <svg key={`e${i}`} className="w-3.5 h-3.5 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
            ))}
          </div>
          <span className="text-xs text-slate-500 font-mono">{product.rating}</span>
          <span className="text-xs text-slate-600">({product.reviews.toLocaleString()})</span>
        </div>

        {/* Price + CTA */}
        <div className="flex items-end justify-between">
          <div>
            <span className="text-lg font-bold text-slate-100">{formatPrice(product.price)}</span>
            {product.originalPrice > product.price && (
              <span className="text-xs text-slate-500 line-through ml-2">{formatPrice(product.originalPrice)}</span>
            )}
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleAddToCart}
            className="w-9 h-9 rounded-xl bg-accent-blue/15 hover:bg-accent-blue text-accent-blue hover:text-white flex items-center justify-center transition-all duration-200 border border-accent-blue/30 hover:border-accent-blue"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M12 4v16m8-8H4" />
            </svg>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
