import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const StarIcon = ({ filled }) => (
  <svg className={`w-3.5 h-3.5 ${filled ? 'text-yellow-400' : 'text-ink-600'}`} fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const CartPlusIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

export default function ProductCard({ product }) {
  const { addItem, items } = useCart();
  const inCart = items.some(i => i._id === product._id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    toast.success(`${product.name} added to cart!`, {
      style: {
        background: '#1e1e2e',
        color: '#f0ecfa',
        border: '1px solid #2d2d42',
      },
    });
  };

  const discount = product.originalPrice > product.price
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  return (
    <Link to={`/products/${product._id}`} className="group card hover:border-brand-700 transition-all duration-300 flex flex-col">
      {/* Image */}
      <div className="relative overflow-hidden bg-ink-700 aspect-square">
        <img
          src={product.images?.[0] || 'https://via.placeholder.com/400x400?text=No+Image'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => { e.target.src = 'https://via.placeholder.com/400x400?text=No+Image'; }}
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {discount > 0 && (
            <span className="badge bg-brand-600 text-white text-xs font-bold">
              -{discount}%
            </span>
          )}
          {product.stock === 0 && (
            <span className="badge bg-red-900/80 text-red-300">
              Out of Stock
            </span>
          )}
          {product.featured && (
            <span className="badge bg-yellow-900/80 text-yellow-300">
              Featured
            </span>
          )}
        </div>

        {/* Quick Add - shows on hover */}
        <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`w-full py-3 flex items-center justify-center gap-2 text-sm font-medium transition-colors
              ${product.stock === 0
                ? 'bg-ink-700 text-ink-600 cursor-not-allowed'
                : inCart
                ? 'bg-brand-700 text-brand-200'
                : 'bg-brand-600 hover:bg-brand-500 text-white'
              }`}
          >
            <CartPlusIcon />
            {product.stock === 0 ? 'Out of Stock' : inCart ? 'In Cart' : 'Add to Cart'}
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 p-4">
        <p className="text-xs text-brand-400 font-medium mb-1 uppercase tracking-wide">{product.brand || product.category}</p>
        <h3 className="text-sm font-semibold text-white group-hover:text-brand-300 transition-colors line-clamp-2 flex-1">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mt-2">
          <div className="flex">
            {[1, 2, 3, 4, 5].map(star => (
              <StarIcon key={star} filled={star <= Math.round(product.rating)} />
            ))}
          </div>
          <span className="text-xs text-surface-300">({product.numReviews})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mt-2">
          <span className="text-lg font-bold text-white">${product.price.toFixed(2)}</span>
          {product.originalPrice > product.price && (
            <span className="text-sm text-ink-600 line-through">${product.originalPrice.toFixed(2)}</span>
          )}
        </div>

        {/* Stock indicator */}
        {product.stock > 0 && product.stock <= 10 && (
          <p className="text-xs text-orange-400 mt-1">Only {product.stock} left!</p>
        )}
      </div>
    </Link>
  );
}
