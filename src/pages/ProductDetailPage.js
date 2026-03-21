import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import Button from '../components/Button';
import { DetailSkeleton } from '../components/Skeleton';
import { useCart } from '../context/CartContext';
import { formatPrice, calcDiscount, getStars } from '../utils/helpers';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState(null);
  const { addToCart, toggleWishlist, isInWishlist, addRecentlyViewed } = useCart();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.getProduct(id);
        setProduct(res.data);
        setRelated(res.related);
        addRecentlyViewed(res.data);
        setQuantity(1);
      } catch (err) {
        setError('Product not found');
      } finally {
        setLoading(false);
      }
    };
    load();
    window.scrollTo(0, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) return <DetailSkeleton />;

  if (error || !product) {
    return (
      <div className="min-h-screen pt-24 flex flex-col items-center justify-center">
        <div className="w-16 h-16 rounded-2xl bg-dark-600 flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-slate-200 mb-2">Product Not Found</h2>
        <Link to="/products" className="text-sm text-accent-blue hover:underline">Back to products</Link>
      </div>
    );
  }

  const stars = getStars(product.rating);
  const discount = calcDiscount(product.originalPrice, product.price);
  const wishlisted = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(`Added ${quantity}x ${product.name.split(' ').slice(0, 3).join(' ')} to cart`, {
      style: { background: '#1a2236', color: '#f1f5f9', border: '1px solid rgba(56,130,246,0.2)' },
      iconTheme: { primary: '#3882f6', secondary: '#f1f5f9' },
    });
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-mono text-slate-500 mb-6">
          <Link to="/" className="hover:text-slate-300">HOME</Link>
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 5l7 7-7 7" /></svg>
          <Link to="/products" className="hover:text-slate-300">PRODUCTS</Link>
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 5l7 7-7 7" /></svg>
          <span className="text-accent-blue truncate max-w-[200px]">{product.name.toUpperCase()}</span>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden bg-dark-700 border border-blue-500/10 aspect-square">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {discount > 0 && (
                <div className="absolute top-4 left-4 px-3 py-1.5 rounded-lg bg-gradient-to-r from-accent-blue to-accent-cyan text-white text-sm font-bold">
                  -{discount}% OFF
                </div>
              )}
            </div>
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            <p className="text-xs font-mono text-accent-blue tracking-widest uppercase mb-2">{product.category}</p>
            <h1 className="text-2xl sm:text-3xl font-bold mb-3 leading-tight">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex gap-0.5">
                {[...Array(stars.full)].map((_, i) => (
                  <svg key={`f${i}`} className="w-4 h-4 text-yellow-400 fill-yellow-400" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                ))}
                {[...Array(stars.empty)].map((_, i) => (
                  <svg key={`e${i}`} className="w-4 h-4 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                ))}
              </div>
              <span className="text-sm font-medium text-slate-300">{product.rating}</span>
              <span className="text-sm text-slate-500">({product.reviews.toLocaleString()} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6 pb-6 border-b border-blue-500/10">
              <span className="text-3xl font-bold text-gradient">{formatPrice(product.price)}</span>
              {product.originalPrice > product.price && (
                <span className="text-lg text-slate-500 line-through">{formatPrice(product.originalPrice)}</span>
              )}
              {discount > 0 && (
                <span className="text-sm text-green-400 font-medium">You save {formatPrice(product.originalPrice - product.price)}</span>
              )}
            </div>

            {/* Description */}
            <p className="text-sm text-slate-400 leading-relaxed mb-6">{product.description}</p>

            {/* Specs */}
            {product.specs && (
              <div className="grid grid-cols-2 gap-2 mb-6">
                {product.specs.map((spec, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-slate-300">
                    <svg className="w-4 h-4 text-accent-cyan shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                    {spec}
                  </div>
                ))}
              </div>
            )}

            {/* Quantity + Add to Cart */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex items-center h-12 rounded-xl bg-dark-700 border border-blue-500/15 overflow-hidden">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-12 h-full flex items-center justify-center text-slate-400 hover:text-slate-200 hover:bg-dark-600 transition-all"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M20 12H4" /></svg>
                </button>
                <span className="w-12 text-center font-mono font-semibold text-slate-200">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => Math.min(10, q + 1))}
                  className="w-12 h-full flex items-center justify-center text-slate-400 hover:text-slate-200 hover:bg-dark-600 transition-all"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M12 4v16m8-8H4" /></svg>
                </button>
              </div>

              <Button onClick={handleAddToCart} size="lg" className="flex-1">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                </svg>
                Add to Cart
              </Button>

              <button
                onClick={() => {
                  toggleWishlist(product);
                  toast(wishlisted ? 'Removed from wishlist' : 'Added to wishlist', {
                    icon: wishlisted ? '💔' : '❤️',
                    style: { background: '#1a2236', color: '#f1f5f9', border: '1px solid rgba(56,130,246,0.2)' },
                  });
                }}
                className={`h-12 w-12 shrink-0 rounded-xl border flex items-center justify-center transition-all ${
                  wishlisted
                    ? 'bg-pink-500/15 border-pink-500/30 text-pink-500'
                    : 'bg-dark-700 border-blue-500/15 text-slate-400 hover:text-pink-400 hover:border-pink-500/30'
                }`}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill={wishlisted ? 'currentColor' : 'none'}>
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </button>
            </div>

            {/* Stock + Shipping */}
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-green-400">In Stock</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-500">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                </svg>
                Free shipping over $100
              </div>
            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-20">
            <h2 className="text-xl font-bold mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
