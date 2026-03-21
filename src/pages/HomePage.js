import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import { CardSkeleton } from '../components/Skeleton';
import { useCart } from '../context/CartContext';
import { formatPrice, calcDiscount } from '../utils/helpers';
import api from '../services/api';

const categoryIcons = {
  Electronics: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
    </svg>
  ),
  Fashion: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path d="M6.115 5.19l.319 1.913A6 6 0 008.11 10.36L9.75 12l-.387.775c-.217.433-.132.956.21 1.298l1.348 1.348c.21.21.329.497.329.795v1.089c0 .426.24.815.622 1.006l.153.076c.433.217.956.132 1.298-.21l.723-.723a8.7 8.7 0 002.288-4.042 1.087 1.087 0 00-.358-1.099l-1.33-1.108c-.251-.21-.582-.299-.905-.245l-1.17.195a1.125 1.125 0 01-.98-.314l-.295-.295a1.125 1.125 0 010-1.591l.13-.132a1.125 1.125 0 011.3-.21l.603.302a.809.809 0 001.086-1.086L14.25 7.5l1.256-.837a4.5 4.5 0 001.528-1.732l.146-.292M6.115 5.19A9 9 0 1017.18 4.64M6.115 5.19A8.965 8.965 0 0112 3c1.929 0 3.716.607 5.18 1.64" />
    </svg>
  ),
  Groceries: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
    </svg>
  ),
  Sports: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
    </svg>
  ),
  Home: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>
  ),
};

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [trending, setTrending] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trendingIdx, setTrendingIdx] = useState(0);
  const { recentlyViewed } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const [featRes, trendRes, catRes] = await Promise.all([
          api.getFeatured(),
          api.getTrending(),
          api.getCategories(),
        ]);
        setFeatured(featRes.data);
        setTrending(trendRes.data);
        setCategories(catRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Auto-rotate trending carousel
  useEffect(() => {
    if (trending.length === 0) return;
    const timer = setInterval(() => {
      setTrendingIdx(i => (i + 1) % trending.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [trending.length]);

  const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08 } },
  };
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-screen">
      {/* ═══ HERO ═══ */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-dark-900">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-blue/8 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent-violet/6 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-blue-500/5 rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] border border-blue-500/3 rounded-full" />
          {/* Grid lines */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `linear-gradient(rgba(56,130,246,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(56,130,246,0.3) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }} />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-blue/10 border border-accent-blue/20 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan animate-pulse" />
              <span className="text-xs font-mono text-accent-cyan tracking-wider">SECURE COMMERCE PLATFORM</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6"
          >
            Shop Smart, Shop Secure
            <br />
            <span className="text-gradient">with SmartKart</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Enterprise-grade security meets seamless shopping. Browse thousands of curated products with end-to-end encrypted transactions and real-time threat monitoring.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/products"
              className="inline-flex items-center justify-center gap-2 h-12 px-8 rounded-xl bg-gradient-to-r from-accent-blue to-blue-500 text-white font-semibold text-sm hover:shadow-glow-lg transition-all duration-300"
            >
              Shop Now
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              to="/products?sort=price-asc"
              className="inline-flex items-center justify-center gap-2 h-12 px-8 rounded-xl bg-dark-600 border border-blue-500/20 text-slate-300 font-semibold text-sm hover:border-blue-500/40 hover:bg-dark-500 transition-all duration-300"
            >
              Explore Deals
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-16 grid grid-cols-3 gap-8 max-w-md mx-auto"
          >
            {[
              { value: '10K+', label: 'Products' },
              { value: '99.9%', label: 'Uptime' },
              { value: '256-bit', label: 'Encryption' },
            ].map(stat => (
              <div key={stat.label} className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-gradient font-mono">{stat.value}</div>
                <div className="text-xs text-slate-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══ CATEGORIES ═══ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <motion.div variants={fadeUp} className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-mono text-accent-blue tracking-widest uppercase mb-2">Browse</p>
              <h2 className="text-2xl sm:text-3xl font-bold">Categories</h2>
            </div>
            <Link to="/products" className="text-sm text-slate-400 hover:text-accent-blue transition-colors flex items-center gap-1">
              View All
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M9 5l7 7-7 7" /></svg>
            </Link>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {(loading ? [...Array(5)] : categories).map((cat, i) => (
              <motion.div key={cat?.id || i} variants={fadeUp}>
                {loading ? (
                  <div className="h-28 skeleton rounded-2xl" />
                ) : (
                  <Link
                    to={`/products?category=${cat.name}`}
                    className="group flex flex-col items-center justify-center h-28 rounded-2xl bg-dark-700 border border-blue-500/10 hover:border-blue-500/30 hover:bg-dark-600 transition-all duration-300"
                  >
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-2 transition-colors duration-300" style={{ backgroundColor: cat.color + '15', color: cat.color }}>
                      {categoryIcons[cat.name] || categoryIcons.Electronics}
                    </div>
                    <span className="text-sm font-medium text-slate-300 group-hover:text-slate-100 transition-colors">{cat.name}</span>
                    <span className="text-xs text-slate-600 font-mono">{cat.count} items</span>
                  </Link>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ═══ TRENDING DEALS CAROUSEL ═══ */}
      {trending.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-mono text-accent-cyan tracking-widest uppercase mb-2">Hot</p>
              <h2 className="text-2xl sm:text-3xl font-bold">Trending Deals</h2>
            </div>
            <div className="flex gap-2">
              {trending.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setTrendingIdx(i)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${i === trendingIdx ? 'bg-accent-blue w-6' : 'bg-dark-500'}`}
                />
              ))}
            </div>
          </div>

          <motion.div
            key={trendingIdx}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-dark-700 to-dark-800 border border-blue-500/15"
          >
            <div className="grid md:grid-cols-2 gap-6 p-6 sm:p-8">
              <div className="relative h-64 md:h-auto rounded-xl overflow-hidden">
                <img
                  src={trending[trendingIdx]?.image}
                  alt={trending[trendingIdx]?.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 px-3 py-1 rounded-lg bg-red-500/90 text-white text-xs font-bold">
                  SAVE {calcDiscount(trending[trendingIdx]?.originalPrice, trending[trendingIdx]?.price)}%
                </div>
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-xs font-mono text-accent-blue mb-2 tracking-wider">{trending[trendingIdx]?.category?.toUpperCase()}</p>
                <h3 className="text-2xl font-bold mb-3">{trending[trendingIdx]?.name}</h3>
                <p className="text-sm text-slate-400 mb-4 leading-relaxed line-clamp-3">{trending[trendingIdx]?.description}</p>
                <div className="flex items-baseline gap-3 mb-6">
                  <span className="text-3xl font-bold text-gradient">{formatPrice(trending[trendingIdx]?.price)}</span>
                  <span className="text-lg text-slate-500 line-through">{formatPrice(trending[trendingIdx]?.originalPrice)}</span>
                </div>
                <button
                  onClick={() => navigate(`/product/${trending[trendingIdx]?.id}`)}
                  className="self-start inline-flex items-center gap-2 h-11 px-6 rounded-xl bg-gradient-to-r from-accent-blue to-blue-500 text-white text-sm font-semibold hover:shadow-glow transition-all"
                >
                  View Deal
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                </button>
              </div>
            </div>
          </motion.div>
        </section>
      )}

      {/* ═══ FEATURED PRODUCTS ═══ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}>
          <motion.div variants={fadeUp} className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-mono text-accent-violet tracking-widest uppercase mb-2">Curated</p>
              <h2 className="text-2xl sm:text-3xl font-bold">Featured Products</h2>
            </div>
            <Link to="/products" className="text-sm text-slate-400 hover:text-accent-blue transition-colors flex items-center gap-1">
              See All
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M9 5l7 7-7 7" /></svg>
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {loading
              ? [...Array(8)].map((_, i) => <CardSkeleton key={i} />)
              : featured.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} />
                ))
            }
          </div>
        </motion.div>
      </section>

      {/* ═══ RECENTLY VIEWED ═══ */}
      {recentlyViewed.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-mono text-slate-500 tracking-widest uppercase mb-2">History</p>
              <h2 className="text-2xl sm:text-3xl font-bold">Recently Viewed</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {recentlyViewed.slice(0, 4).map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* ═══ CTA BANNER ═══ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-accent-blue/10 via-accent-violet/10 to-accent-cyan/10 border border-blue-500/15 p-8 sm:p-12 text-center"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent-blue/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent-violet/10 rounded-full blur-3xl" />
          <div className="relative z-10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">Ready to Shop Securely?</h2>
            <p className="text-slate-400 mb-6 max-w-lg mx-auto">Join thousands of security-conscious shoppers who trust SmartKart for their online purchases.</p>
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 h-12 px-8 rounded-xl bg-gradient-to-r from-accent-blue to-blue-500 text-white font-semibold text-sm hover:shadow-glow-lg transition-all"
            >
              Create Free Account
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
