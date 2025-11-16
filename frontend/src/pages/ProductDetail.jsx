import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { sweetsAPI } from '../utils/api';
import { useCart } from '../hooks/useCart';

const ProductDetail = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sweet, setSweet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [success, setSuccess] = useState('');
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const { data } = await sweetsAPI.getAllSweets();
      const product = data.sweets.find(s => s._id === id);
      if (product) {
        setSweet(product);
      } else {
        setError('Product not found');
      }
    } catch (err) {
      setError('Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (quantity <= 0) {
      setError('Please select a valid quantity');
      return;
    }
    const success = await addToCart(id, quantity);
    if (success) {
      setSuccess('✅ Added to cart!');
      setTimeout(() => setSuccess(''), 3000);
    } else {
      setError('Failed to add to cart');
    }
  };

  const handleBuyNow = async () => {
    if (quantity <= 0) {
      setError('Please select a valid quantity');
      return;
    }
    const success = await addToCart(id, quantity);
    if (success) {
      navigate('/cart');
    } else {
      setError('Failed to add to cart');
    }
  };

  const getSweetEmoji = (category) => {
    const emojiMap = {
      'Gulab Jamun': '🍫',
      'Rasgulla': '⚪',
      'Jalebi': '🌀',
      'Barfi': '🟫',
      'Laddu': '🟡',
      'Kheer': '🥣',
      'Halwa': '🍯',
      'Fafda': '🍪',
      'Chocolates': '🍫',
      'Gummies': '🍬',
      'Lollipops': '🍭',
      'Candy Jars': '🫙',
      'Macarons': '🍪',
    };
    return emojiMap[category] || '🍰';
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', paddingTop: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="loading"><div className="spinner"></div></div>
      </div>
    );
  }

  if (error || !sweet) {
    return (
      <div style={{ minHeight: '100vh', paddingTop: '80px', padding: '40px 20px' }}>
        <div className="container">
          <div className="alert alert-error">{error || 'Product not found'}</div>
          <button onClick={() => navigate('/dashboard')} className="btn btn-primary">
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const stockStatus = sweet.quantity > 10 ? 'In Stock' : sweet.quantity > 0 ? 'Low Stock' : 'Out of Stock';
  const stockColor = sweet.quantity > 10 ? '#27AE60' : sweet.quantity > 0 ? '#F4A460' : '#FF6B6B';

  return (
    <div style={{ minHeight: '100vh', background: 'white', paddingTop: '80px', paddingBottom: '40px' }}>
      <div className="container">
        {success && <div className="alert alert-success">{success}</div>}
        {error && <div className="alert alert-error">{error}</div>}

        {/* Breadcrumb */}
        <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '8px', color: '#999', fontSize: '14px' }}>
          <button onClick={() => navigate('/dashboard')} style={{ background: 'none', border: 'none', color: '#A8E6CF', cursor: 'pointer', fontSize: '14px' }}>
            Products
          </button>
          <span>/</span>
          <span>{sweet.category}</span>
          <span>/</span>
          <span>{sweet.name}</span>
        </div>

        {/* Product Detail Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'start' }}>
          {/* Left - Product Image */}
          <div>
            <div style={{
              background: 'linear-gradient(135deg, #FFE5F0 0%, #E5F5F0 100%)',
              borderRadius: '20px',
              padding: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '500px',
              marginBottom: '20px'
            }}>
              {sweet.image ? (
                <img
                  src={sweet.image}
                  alt={sweet.name}
                  style={{ maxWidth: '100%', maxHeight: '400px', objectFit: 'contain' }}
                />
              ) : (
                <div style={{ fontSize: '200px' }}>
                  {getSweetEmoji(sweet.category)}
                </div>
              )}
            </div>
          </div>

          {/* Right - Product Details */}
          <div>
            {/* Category Badge */}
            <div style={{ marginBottom: '16px' }}>
              <span style={{
                display: 'inline-block',
                background: '#E5F5F0',
                color: '#27AE60',
                padding: '6px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: '500'
              }}>
                {sweet.category}
              </span>
            </div>

            {/* Product Name */}
            <h1 style={{
              fontSize: '42px',
              fontWeight: '500',
              color: '#4a4a4a',
              marginBottom: '16px',
              lineHeight: '1.2'
            }}>
              {sweet.name}
            </h1>

            {/* Rating & Reviews */}
            <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ fontSize: '18px' }}>⭐⭐⭐⭐⭐</div>
              <span style={{ color: '#999', fontSize: '14px' }}>(128 reviews)</span>
            </div>

            {/* Price Section */}
            <div style={{
              background: '#F8FFFE',
              padding: '20px',
              borderRadius: '16px',
              marginBottom: '24px',
              border: '1px solid #E8F5F0'
            }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '8px' }}>
                <span style={{ fontSize: '36px', fontWeight: '600', color: '#A8E6CF' }}>
                  ₹{sweet.price.toFixed(2)}
                </span>
              </div>
              <p style={{ color: '#999', fontSize: '14px', margin: 0 }}>
                Inclusive of all taxes
              </p>
            </div>

            {/* Stock Status */}
            <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: stockColor
              }} />
              <span style={{ color: stockColor, fontWeight: '500', fontSize: '16px' }}>
                {stockStatus}
              </span>
              <span style={{ color: '#999', fontSize: '14px' }}>
                ({sweet.quantity} available)
              </span>
            </div>

            {/* Quantity Selector */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#4a4a4a' }}>
                Quantity:
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '8px',
                    border: '1px solid #E8F5F0',
                    background: 'white',
                    cursor: 'pointer',
                    fontSize: '18px',
                    fontWeight: '500'
                  }}
                >
                  −
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 1;
                    if (val > 0 && val <= sweet.quantity) {
                      setQuantity(val);
                    }
                  }}
                  min="1"
                  max={sweet.quantity}
                  style={{
                    width: '60px',
                    height: '40px',
                    borderRadius: '8px',
                    border: '1px solid #E8F5F0',
                    textAlign: 'center',
                    fontSize: '16px',
                    fontWeight: '500'
                  }}
                />
                <button
                  onClick={() => setQuantity(Math.min(sweet.quantity, quantity + 1))}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '8px',
                    border: '1px solid #E8F5F0',
                    background: 'white',
                    cursor: 'pointer',
                    fontSize: '18px',
                    fontWeight: '500'
                  }}
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart & Buy Now Buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
              <button
                onClick={handleAddToCart}
                disabled={sweet.quantity === 0}
                className="btn btn-primary"
                style={{
                  padding: '16px',
                  fontSize: '18px',
                  fontWeight: '600'
                }}
              >
                🛒 Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                disabled={sweet.quantity === 0}
                className="btn btn-success"
                style={{
                  padding: '16px',
                  fontSize: '18px',
                  fontWeight: '600'
                }}
              >
                💳 Buy Now
              </button>
            </div>

            {/* Back Button */}
            <button
              onClick={() => navigate('/dashboard')}
              className="btn btn-secondary"
              style={{
                width: '100%',
                padding: '16px',
                fontSize: '18px',
                fontWeight: '600'
              }}
            >
              Continue Shopping
            </button>

            {/* Product Description */}
            <div style={{ marginTop: '40px', paddingTop: '40px', borderTop: '1px solid #E8F5F0' }}>
              <h3 style={{ fontSize: '20px', fontWeight: '500', color: '#4a4a4a', marginBottom: '16px' }}>
                About this product
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                <div>
                  <p style={{ color: '#999', fontSize: '14px', margin: '0 0 8px 0' }}>Category</p>
                  <p style={{ color: '#4a4a4a', fontSize: '16px', fontWeight: '500', margin: 0 }}>
                    {sweet.category}
                  </p>
                </div>
                <div>
                  <p style={{ color: '#999', fontSize: '14px', margin: '0 0 8px 0' }}>Price</p>
                  <p style={{ color: '#A8E6CF', fontSize: '16px', fontWeight: '600', margin: 0 }}>
                    ₹{sweet.price.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p style={{ color: '#999', fontSize: '14px', margin: '0 0 8px 0' }}>Stock Available</p>
                  <p style={{ color: '#4a4a4a', fontSize: '16px', fontWeight: '500', margin: 0 }}>
                    {sweet.quantity} units
                  </p>
                </div>
                <div>
                  <p style={{ color: '#999', fontSize: '14px', margin: '0 0 8px 0' }}>Status</p>
                  <p style={{ color: stockColor, fontSize: '16px', fontWeight: '500', margin: 0 }}>
                    {stockStatus}
                  </p>
                </div>
              </div>

              <p style={{ color: '#666', fontSize: '15px', lineHeight: '1.8', fontWeight: '300' }}>
                Handcrafted with premium ingredients, this delicious {sweet.category.toLowerCase()} is made fresh daily. 
                Perfect for celebrations, gifts, or simply treating yourself to something special. 
                Each piece is carefully prepared to ensure the highest quality and taste.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
