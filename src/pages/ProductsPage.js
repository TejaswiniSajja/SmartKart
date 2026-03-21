import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import { ListSkeleton } from '../components/Skeleton';
import api from '../services/api';

const priceRanges = [
  { label: 'All Prices', min: 0, max: Infinity },
  { label: 'Under $50', min: 0, max: 50 },
  { label: '$50 - $100', min: 50, max: 100 },
  { label: '$100 - $200', min: 100, max: 200 },
  { label: '$200 - $500', min: 200, max: 500 },
  { label: '$500+', min: 500, max: Infinity },
];

const sortOptions = [
  { value: '', label: 'Default' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'name', label: 'Name A-Z' },
];

const ratingOptions = [0, 4, 4.5];

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const category = searchParams.get('category') || 'All';
  const sort = searchParams.get('sort') || '';
  const search = searchParams.get('search') || '';
  const priceIdx = parseInt(searchParams.get('price') || '0');
  const minRating = parseFloat(searchParams.get('rating') || '0');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const range = priceRanges[priceIdx] || priceRanges[0];
        const res = await api.getProducts({
          category,
          sort,
          search,
          minPrice: range.min,
          maxPrice: range.max === Infinity ? undefined : range.max,
          minRating: minRating || undefined,
        });
        setProducts(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [category, sort, search, priceIdx, minRating]);

  const updateFilter = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value && value !== 'All' && value !== '0' && value !== '') {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  const hasFilters = category !== 'All' || sort || search || priceIdx > 0 || minRating > 0;

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500 mb-2">
            <span>HOME</span>
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 5l7 7-7 7" /></svg>
            <span className="text-accent-blue">PRODUCTS</span>
            {search && (
              <>
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 5l7 7-7 7" /></svg>
                <span className="text-accent-cyan">"{search}"</span>
              </>
            )}
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">
                {search ? `Results for "${search}"` : category !== 'All' ? category : 'All Products'}
              </h1>
              {!loading && <p className="text-sm text-slate-500 mt-1">{products.length} product{products.length !== 1 ? 's' : ''} found</p>}
            </div>
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="sm:hidden flex items-center gap-2 h-10 px-4 rounded-xl bg-dark-700 border border-blue-500/15 text-sm text-slate-300"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filters
              {hasFilters && <span className="w-2 h-2 rounded-full bg-accent-blue" />}
            </button>
          </div>
        </motion.div>

        <div className="flex gap-6">
          {/* Sidebar Filters */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`${filtersOpen ? 'block' : 'hidden'} sm:block w-full sm:w-56 shrink-0 ${filtersOpen ? 'fixed inset-0 z-40 bg-dark-900/95 p-6 pt-20 overflow-y-auto' : ''}`}
          >
            {filtersOpen && (
              <button
                onClick={() => setFiltersOpen(false)}
                className="sm:hidden absolute top-4 right-4 w-8 h-8 rounded-lg bg-dark-600 flex items-center justify-center text-slate-300"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            )}

            <div className="space-y-6">
              {/* Category */}
              <div>
                <h3 className="text-xs font-mono text-slate-400 tracking-widest uppercase mb-3">Category</h3>
                <div className="space-y-1">
                  {['All', 'Electronics', 'Fashion', 'Groceries', 'Sports', 'Home'].map(cat => (
                    <button
                      key={cat}
                      onClick={() => { updateFilter('category', cat); setFiltersOpen(false); }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                        category === cat
                          ? 'bg-accent-blue/15 text-accent-blue border border-accent-blue/20'
                          : 'text-slate-400 hover:bg-dark-600 hover:text-slate-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div>
                <h3 className="text-xs font-mono text-slate-400 tracking-widest uppercase mb-3">Price Range</h3>
                <div className="space-y-1">
                  {priceRanges.map((range, i) => (
                    <button
                      key={i}
                      onClick={() => { updateFilter('price', String(i)); setFiltersOpen(false); }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                        priceIdx === i
                          ? 'bg-accent-blue/15 text-accent-blue border border-accent-blue/20'
                          : 'text-slate-400 hover:bg-dark-600 hover:text-slate-200'
                      }`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rating */}
              <div>
                <h3 className="text-xs font-mono text-slate-400 tracking-widest uppercase mb-3">Min Rating</h3>
                <div className="space-y-1">
                  {ratingOptions.map(r => (
                    <button
                      key={r}
                      onClick={() => { updateFilter('rating', String(r)); setFiltersOpen(false); }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center gap-2 ${
                        minRating === r
                          ? 'bg-accent-blue/15 text-accent-blue border border-accent-blue/20'
                          : 'text-slate-400 hover:bg-dark-600 hover:text-slate-200'
                      }`}
                    >
                      {r === 0 ? 'All Ratings' : (
                        <>
                          {r}+
                          <svg className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                        </>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort */}
              <div>
                <h3 className="text-xs font-mono text-slate-400 tracking-widest uppercase mb-3">Sort By</h3>
                <select
                  value={sort}
                  onChange={(e) => updateFilter('sort', e.target.value)}
                  className="w-full bg-dark-700 border border-blue-500/15 rounded-xl px-3 py-2.5 text-sm text-slate-300"
                >
                  {sortOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="w-full text-center py-2 text-sm text-red-400 hover:text-red-300 transition-colors"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          </motion.aside>

          {/* Product Grid */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <ListSkeleton count={8} />
            ) : products.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-20"
              >
                <div className="w-16 h-16 rounded-2xl bg-dark-600 flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-300 mb-2">No products found</h3>
                <p className="text-sm text-slate-500 mb-4">Try adjusting your filters or search query</p>
                <button onClick={clearFilters} className="text-sm text-accent-blue hover:underline">Clear filters</button>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {products.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
