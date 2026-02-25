import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productsAPI } from '../api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const StarIcon = ({ filled, onClick }) => (
  <svg
    className={`w-5 h-5 cursor-pointer transition-colors ${filled ? 'text-yellow-400' : 'text-ink-600 hover:text-yellow-400'}`}
    fill="currentColor"
    viewBox="0 0 20 20"
    onClick={onClick}
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const BackIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    productsAPI.getById(id)
      .then(({ data }) => {
        setProduct(data.product);
      })
      .catch(() => {
        toast.error('Product not found');
        navigate('/products');
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleAddToCart = () => {
    addItem(product, quantity);
    toast.success(`${quantity} × ${product.name} added to cart!`, {
      style: { background: '#1e1e2e', color: '#f0ecfa', border: '1px solid #2d2d42' }
    });
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to leave a review');
      navigate('/login');
      return;
    }

    setSubmittingReview(true);
    try {
      await productsAPI.addReview(id, reviewForm);
      toast.success('Review submitted!');
      // Refresh product
      const { data } = await productsAPI.getById(id);
      setProduct(data.product);
      setReviewForm({ rating: 5, comment: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="aspect-square shimmer-box rounded-2xl" />
          <div className="space-y-4">
            <div className="h-6 w-32 shimmer-box rounded" />
            <div className="h-8 w-full shimmer-box rounded" />
            <div className="h-8 w-2/3 shimmer-box rounded" />
            <div className="h-10 w-40 shimmer-box rounded mt-6" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const discount = product.originalPrice > product.price
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-surface-300 hover:text-white mb-6 transition-colors text-sm"
      >
        <BackIcon />
        Back to Products
      </button>

      <div className="grid md:grid-cols-2 gap-12 mb-16 animate-fade-in">
        {/* Images */}
        <div className="space-y-4">
          <div className="aspect-square rounded-2xl overflow-hidden bg-ink-800 border border-ink-700">
            <img
              src={product.images?.[selectedImage] || 'https://via.placeholder.com/600x600?text=No+Image'}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => { e.target.src = 'https://via.placeholder.com/600x600?text=No+Image'; }}
            />
          </div>

          {product.images?.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === i ? 'border-brand-500' : 'border-ink-700 hover:border-ink-500'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="badge bg-brand-950 text-brand-400 border border-brand-800">{product.category}</span>
            {product.brand && (
              <span className="badge bg-ink-700 text-surface-300">{product.brand}</span>
            )}
            {product.featured && (
              <span className="badge bg-yellow-950 text-yellow-400">⭐ Featured</span>
            )}
          </div>

          <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex">
              {[1, 2, 3, 4, 5].map(star => (
                <StarIcon key={star} filled={star <= Math.round(product.rating)} />
              ))}
            </div>
            <span className="text-surface-300 text-sm">
              {product.rating.toFixed(1)} ({product.numReviews} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-4 mb-6">
            <span className="font-display text-4xl font-bold text-white">${product.price.toFixed(2)}</span>
            {discount > 0 && (
              <>
                <span className="text-xl text-ink-600 line-through">${product.originalPrice.toFixed(2)}</span>
                <span className="badge bg-brand-700 text-brand-200 text-sm font-bold py-1 px-3">
                  Save {discount}%
                </span>
              </>
            )}
          </div>

          {/* Stock */}
          <div className="mb-6">
            {product.stock === 0 ? (
              <span className="text-red-400 font-medium">Out of Stock</span>
            ) : product.stock <= 10 ? (
              <span className="text-orange-400 font-medium">⚡ Only {product.stock} left in stock!</span>
            ) : (
              <span className="text-green-400 font-medium">✓ In Stock ({product.stock} available)</span>
            )}
          </div>

          {/* Description */}
          <p className="text-surface-300 leading-relaxed mb-8">{product.description}</p>

          {/* Tags */}
          {product.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {product.tags.map(tag => (
                <span key={tag} className="badge bg-ink-700 text-surface-300 py-1 px-3 text-xs">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Quantity + Add to Cart */}
          {product.stock > 0 && (
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center bg-ink-800 border border-ink-600 rounded-lg overflow-hidden">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="px-4 py-3 text-surface-300 hover:text-white hover:bg-ink-700 transition-colors"
                >
                  −
                </button>
                <span className="px-5 py-3 text-white font-medium min-w-[3rem] text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                  className="px-4 py-3 text-surface-300 hover:text-white hover:bg-ink-700 transition-colors"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="btn-primary flex-1 py-3"
              >
                Add to Cart — ${(product.price * quantity).toFixed(2)}
              </button>
            </div>
          )}

          {/* Benefits */}
          <div className="grid grid-cols-3 gap-3 p-4 bg-ink-800 border border-ink-700 rounded-xl text-center">
            {[
              { icon: '🚚', label: 'Free Shipping', sub: 'Over $50' },
              { icon: '↩️', label: 'Easy Returns', sub: '30 days' },
              { icon: '🔒', label: 'Secure Pay', sub: 'SSL Encrypted' },
            ].map(b => (
              <div key={b.label}>
                <p className="text-xl mb-1">{b.icon}</p>
                <p className="text-xs font-medium text-white">{b.label}</p>
                <p className="text-xs text-surface-300">{b.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="grid md:grid-cols-2 gap-12">
        {/* Reviews List */}
        <div>
          <h2 className="font-display text-2xl font-bold text-white mb-6">
            Customer Reviews ({product.numReviews})
          </h2>

          {product.reviews?.length === 0 ? (
            <div className="card p-8 text-center text-surface-300">
              <p className="text-4xl mb-3">💬</p>
              <p>No reviews yet. Be the first to review!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {product.reviews?.map((review) => (
                <div key={review._id} className="card p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-brand-700 rounded-full flex items-center justify-center text-xs font-bold text-white">
                        {review.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{review.name}</p>
                        <p className="text-xs text-surface-300">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map(s => (
                        <StarIcon key={s} filled={s <= review.rating} />
                      ))}
                    </div>
                  </div>
                  <p className="text-surface-300 text-sm">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Write Review */}
        <div>
          <h2 className="font-display text-2xl font-bold text-white mb-6">Write a Review</h2>
          <div className="card p-6">
            {!user ? (
              <div className="text-center py-6">
                <p className="text-surface-300 mb-4">Please login to write a review</p>
                <button onClick={() => navigate('/login')} className="btn-primary">
                  Login to Review
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-surface-300 mb-2">Your Rating</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <StarIcon
                        key={star}
                        filled={star <= reviewForm.rating}
                        onClick={() => setReviewForm(f => ({ ...f, rating: star }))}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-300 mb-2">Comment</label>
                  <textarea
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm(f => ({ ...f, comment: e.target.value }))}
                    rows={4}
                    required
                    placeholder="Share your experience with this product..."
                    className="input-field resize-none"
                  />
                </div>

                <button type="submit" disabled={submittingReview} className="btn-primary w-full">
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
