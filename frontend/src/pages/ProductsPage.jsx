import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productsAPI } from '../api';
import ProductCard from '../components/ProductCard';

const FilterIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
  </svg>
);

const ChevronLeft = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const ChevronRight = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const CATEGORIES = ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports', 'Beauty', 'Toys', 'Automotive', 'Food', 'Other'];
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'popular', label: 'Most Popular' },
];

const SkeletonCard = () => (
  <div className="card">
    <div className="aspect-square shimmer-box" />
    <div className="p-4 space-y-2">
      <div className="h-3 w-16 shimmer-box rounded" />
      <div className="h-4 w-full shimmer-box rounded" />
      <div className="h-5 w-20 shimmer-box rounded mt-3" />
    </div>
  </div>
);

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const keyword = searchParams.get('keyword') || '';
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || 'newest';
  const page = parseInt(searchParams.get('page') || '1');
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const featured = searchParams.get('featured') || '';

  const fetchProducts = useCallback(() => {
    setLoading(true);
    const params = { page, limit: 12, sort };
    if (keyword) params.keyword = keyword;
    if (category) params.category = category;
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;
    if (featured) params.featured = featured;

    productsAPI.getAll(params)
      .then(({ data }) => {
        setProducts(data.products);
        setTotalPages(data.totalPages);
        setTotal(data.total);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [keyword, category, sort, page, minPrice, maxPrice, featured]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const updateParam = (key, value) => {
    const params = Object.fromEntries(searchParams);
    if (value) {
      params[key] = value;
    } else {
      delete params[key];
    }
    params.page = '1';
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  const hasFilters = keyword || category || minPrice || maxPrice || featured;

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="section-title">
            {keyword ? `Results for "${keyword}"` : category || 'All Products'}
          </h1>
          {!loading && <p className="text-surface-300 text-sm mt-1">{total} products found</p>}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`btn-secondary text-sm py-2 gap-2 ${showFilters ? 'bg-brand-950 border-brand-600' : ''}`}
          >
            <FilterIcon />
            Filters
            {hasFilters && <span className="w-2 h-2 bg-brand-500 rounded-full" />}
          </button>

          <select
            value={sort}
            onChange={(e) => updateParam('sort', e.target.value)}
            className="bg-ink-800 border border-ink-600 text-surface-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-600"
          >
            {SORT_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="card p-6 mb-6 animate-slide-up">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-surface-300 mb-2">Category</label>
              <select
                value={category}
                onChange={(e) => updateParam('category', e.target.value)}
                className="w-full bg-ink-700 border border-ink-600 text-surface-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-600"
              >
                <option value="">All Categories</option>
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Min Price */}
            <div>
              <label className="block text-sm font-medium text-surface-300 mb-2">Min Price ($)</label>
              <input
                type="number"
                value={minPrice}
                onChange={(e) => updateParam('minPrice', e.target.value)}
                placeholder="0"
                min="0"
                className="w-full bg-ink-700 border border-ink-600 text-surface-200 placeholder-ink-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-600"
              />
            </div>

            {/* Max Price */}
            <div>
              <label className="block text-sm font-medium text-surface-300 mb-2">Max Price ($)</label>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => updateParam('maxPrice', e.target.value)}
                placeholder="1000"
                min="0"
                className="w-full bg-ink-700 border border-ink-600 text-surface-200 placeholder-ink-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-600"
              />
            </div>

            {/* Featured */}
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-3 cursor-pointer">
                <div
                  onClick={() => updateParam('featured', featured ? '' : 'true')}
                  className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${featured ? 'bg-brand-600' : 'bg-ink-600'}`}
                >
                  <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${featured ? 'left-6' : 'left-1'}`} />
                </div>
                <span className="text-sm text-surface-200">Featured Only</span>
              </label>
            </div>
          </div>

          {hasFilters && (
            <button
              onClick={clearFilters}
              className="mt-4 text-sm text-red-400 hover:text-red-300 transition-colors"
            >
              Clear all filters
            </button>
          )}
        </div>
      )}

      {/* Active filters chips */}
      {hasFilters && (
        <div className="flex flex-wrap gap-2 mb-4">
          {keyword && (
            <span className="badge bg-brand-950 text-brand-300 border border-brand-800 py-1 px-3">
              Search: {keyword}
              <button onClick={() => updateParam('keyword', '')} className="ml-2 hover:text-white">×</button>
            </span>
          )}
          {category && (
            <span className="badge bg-brand-950 text-brand-300 border border-brand-800 py-1 px-3">
              {category}
              <button onClick={() => updateParam('category', '')} className="ml-2 hover:text-white">×</button>
            </span>
          )}
          {featured && (
            <span className="badge bg-yellow-950 text-yellow-300 border border-yellow-800 py-1 px-3">
              Featured
              <button onClick={() => updateParam('featured', '')} className="ml-2 hover:text-white">×</button>
            </span>
          )}
        </div>
      )}

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array(12).fill(0).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-6xl mb-4">🔍</p>
          <h3 className="text-xl font-semibold text-white mb-2">No products found</h3>
          <p className="text-surface-300 mb-6">Try adjusting your filters or search term.</p>
          <button onClick={clearFilters} className="btn-primary">Clear Filters</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-10">
          <button
            onClick={() => updateParam('page', String(page - 1))}
            disabled={page === 1}
            className="p-2 btn-secondary disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
            .reduce((acc, p, i, arr) => {
              if (i > 0 && p - arr[i - 1] > 1) acc.push('...');
              acc.push(p);
              return acc;
            }, [])
            .map((p, i) => (
              <span key={i}>
                {p === '...' ? (
                  <span className="px-2 text-surface-300">...</span>
                ) : (
                  <button
                    onClick={() => updateParam('page', String(p))}
                    className={`w-9 h-9 rounded-lg text-sm font-medium transition-all
                      ${p === page ? 'bg-brand-600 text-white' : 'text-surface-300 hover:bg-ink-700 hover:text-white'}`}
                  >
                    {p}
                  </button>
                )}
              </span>
            ))
          }

          <button
            onClick={() => updateParam('page', String(page + 1))}
            disabled={page === totalPages}
            className="p-2 btn-secondary disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight />
          </button>
        </div>
      )}
    </div>
  );
}
