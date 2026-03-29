import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productsAPI } from '../api';
import ProductCard from '../components/ProductCard';

const ArrowRight = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const categories = [
  { name: 'Electronics', icon: '💻', color: 'from-blue-900 to-blue-950' },
  { name: 'Clothing', icon: '👗', color: 'from-pink-900 to-pink-950' },
  { name: 'Sports', icon: '⚽', color: 'from-green-900 to-green-950' },
  { name: 'Beauty', icon: '✨', color: 'from-purple-900 to-purple-950' },
  { name: 'Books', icon: '📚', color: 'from-yellow-900 to-yellow-950' },
  { name: 'Home & Garden', icon: '🏠', color: 'from-teal-900 to-teal-950' },
];

const SkeletonCard = () => (
  <div className="card">
    <div className="aspect-square shimmer-box" />
    <div className="p-4 space-y-2">
      <div className="h-3 w-16 shimmer-box rounded" />
      <div className="h-4 w-full shimmer-box rounded" />
      <div className="h-4 w-2/3 shimmer-box rounded" />
      <div className="h-5 w-20 shimmer-box rounded mt-3" />
    </div>
  </div>
);

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productsAPI.getAll({ featured: true, limit: 4 })
      .then(({ data }) => setFeaturedProducts(data.products))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        {/* Background gradient */}
        <div className="absolute  inset-0 bg-gradient-to-br from-brand-950 via-ink-900 to-ink-900" />
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, #8824ad44 0%, transparent 50%), radial-gradient(circle at 80% 20%, #c44df044 0%, transparent 40%)`
        }} />
        
        <div className="relative max-w-7xl align-items-center items-center mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl  align-items-center items-center">
            <div className="inline-flex items-center gap-2 bg-brand-950 border border-brand-800 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 bg-brand-500 rounded-full animate-pulse" />
              <span className="text-sm text-brand-300 font-medium">New arrivals every week</span>
            </div>
            
            <h1 className="font-display text-5xl md:text-7xl font-bold text-white leading-tight mb-6">
              Shop the{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-brand-600">
                future
              </span>
              {' '}of retail
            </h1>
            
            <p className="text-xl text-surface-300 mb-8 max-w-xl">
              Curated products, exceptional quality. Discover your next favorite thing with free shipping on orders over $50.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link to="/products" className="btn-primary text-base py-3 px-8">
                Shop Now
                <ArrowRight />
              </Link>
              <Link to="/products?featured=true" className="btn-secondary text-base py-3 px-8">
                View Featured
              </Link>
            </div>

            {/* Stats */}
            <div className="flex gap-8 mt-12">
              {[
                { label: 'Products', value: '500+' },
                { label: 'Happy Customers', value: '10k+' },
                { label: 'Free Shipping Over', value: '$50' },
              ].map(stat => (
                <div key={stat.label}>
                  <p className="font-display text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-sm text-surface-300">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="section-title">Shop by Category</h2>
          <Link to="/products" className="text-brand-400 hover:text-brand-300 text-sm font-medium flex items-center gap-1 transition-colors">
            View all <ArrowRight />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map(cat => (
            <Link
              key={cat.name}
              to={`/products?category=${encodeURIComponent(cat.name)}`}
              className={`card bg-gradient-to-br ${cat.color} border-ink-600 hover:border-brand-700 p-5 flex flex-col items-center gap-3 text-center group transition-all duration-300 hover:scale-105`}
            >
              <span className="text-3xl">{cat.icon}</span>
              <span className="text-sm font-medium text-surface-200 group-hover:text-white transition-colors">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="section-title">Featured Products</h2>
          <Link to="/products?featured=true" className="text-brand-400 hover:text-brand-300 text-sm font-medium flex items-center gap-1 transition-colors">
            View all <ArrowRight />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading
            ? Array(4).fill(0).map((_, i) => <SkeletonCard key={i} />)
            : featuredProducts.map(product => (
              <ProductCard key={product._id} product={product} />
            ))
          }
        </div>
      </section>

      {/* Promo Banner */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-900 to-brand-950 border border-brand-800 p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="absolute right-0 top-0 w-64 h-64 rounded-full bg-brand-700/10 -translate-y-1/2 translate-x-1/2" />
          <div className="absolute left-1/3 bottom-0 w-40 h-40 rounded-full bg-brand-600/10 translate-y-1/2" />
          
          <div className="relative">
            <p className="text-brand-400 font-medium mb-2">Limited Time Offer</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-3">
              Free Shipping on All Orders
            </h2>
            <p className="text-surface-300">On orders over $50. Use code <span className="font-mono text-brand-400 bg-brand-950 px-2 py-0.5 rounded">FREESHIP</span></p>
          </div>
          
          <Link to="/products" className="relative btn-primary text-base py-3.5 px-8 flex-shrink-0">
            Shop Now
            <ArrowRight />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-ink-700 py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="font-display text-xl font-bold text-white">Shopora</span>
            </div>
            <p className="text-sm text-surface-300">Premium shopping experience with curated products and exceptional service.</p>
          </div>
          
          {[
            { title: 'Shop', links: ['All Products', 'Electronics', 'Clothing', 'Sports'] },
            { title: 'Account', links: ['Login', 'Register', 'Orders', 'Profile'] },
            { title: 'Support', links: ['FAQ', 'Returns', 'Shipping', 'Contact'] },
          ].map(col => (
            <div key={col.title}>
              <h4 className="font-semibold text-white mb-3">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map(link => (
                  <li key={link}>
                    <span className="text-sm text-surface-300 hover:text-white cursor-pointer transition-colors">{link}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="border-t border-ink-700 pt-6  flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-surface-300 align-center text-center mr-9 items-center">© 2026 Shopora. All rights reserved.</p>
          
        </div>
      </footer>
    </div>
  );
}
