import { useState } from 'react';
import { Link } from 'react-router-dom';

const SweetCard = ({ sweet, isAdmin = false, onPurchase, onDelete, onEdit, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);
  const [showQuantity, setShowQuantity] = useState(false);

  const getQuantityBadgeClass = () => {
    if (sweet.quantity === 0) return 'quantity-badge out';
    if (sweet.quantity < 5) return 'quantity-badge low';
    return 'quantity-badge';
  };

  const getCategoryColor = (category) => {
    const colorMap = {
      'Gulab Jamun': '#FFE5F0',
      'Rasgulla': '#E5F5F0',
      'Jalebi': '#FFF9E5',
      'Barfi': '#F0E5FF',
      'Laddu': '#FFE5F0',
      'Kheer': '#E5F5F0',
      'Halwa': '#FFF9E5',
      'Fafda': '#F0E5FF',
    };
    return colorMap[category] || '#E5F5F0';
  };

  const handleAddToCart = () => {
    onAddToCart?.(sweet._id, quantity);
    setQuantity(1);
    setShowQuantity(false);
  };

  const handleBuyNow = () => {
    onAddToCart?.(sweet._id, quantity);
    window.location.href = '/cart';
  };

  return (
    <Link to={`/product/${sweet._id}`} style={{ textDecoration: 'none' }}>
      <div className="sweet-card">
        <div className="sweet-card-image">
          {sweet.image ? (
            <img
              src={sweet.image}
              alt={sweet.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <div style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: getCategoryColor(sweet.category),
              fontSize: '48px',
              fontWeight: '300',
              color: '#A8E6CF',
              letterSpacing: '2px'
            }}>
              ◆
            </div>
          )}
          <div className="sweet-card-category">
            {sweet.category}
          </div>
        </div>

        <div className="sweet-card-body">
          <h3 className="sweet-card-title">{sweet.name}</h3>
          <p className="sweet-card-price">₹{sweet.price.toFixed(2)}</p>
          <p className="sweet-card-quantity">
            <span className={getQuantityBadgeClass()}>
              {sweet.quantity === 0 ? 'Out of Stock' : `${sweet.quantity} available`}
            </span>
          </p>
        </div>

        <div className="sweet-card-actions" onClick={(e) => e.preventDefault()}>
          {!isAdmin ? (
            <>
              {showQuantity ? (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, background: '#f2f2f7', borderRadius: '12px', padding: '8px' }}>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setQuantity(Math.max(1, quantity - 1));
                      }}
                      style={{ 
                        background: 'white', 
                        border: 'none', 
                        borderRadius: '8px', 
                        width: '32px', 
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '18px',
                        fontWeight: '500',
                        cursor: 'pointer'
                      }}
                    >
                      −
                    </button>
                    <span style={{ flex: 1, textAlign: 'center', fontWeight: '500' }}>{quantity}</span>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setQuantity(quantity + 1);
                      }}
                      style={{ 
                        background: 'white', 
                        border: 'none', 
                        borderRadius: '8px', 
                        width: '32px', 
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '18px',
                        fontWeight: '500',
                        cursor: 'pointer'
                      }}
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleAddToCart();
                    }}
                    disabled={sweet.quantity === 0}
                    className="btn btn-primary"
                    style={{ minWidth: '80px' }}
                  >
                    Add
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleBuyNow();
                    }}
                    disabled={sweet.quantity === 0}
                    className="btn btn-success"
                    style={{ minWidth: '80px' }}
                  >
                    Buy Now
                  </button>
                </>
              ) : (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setShowQuantity(true);
                    }}
                    disabled={sweet.quantity === 0}
                    className="btn btn-primary"
                    style={{ flex: 1 }}
                  >
                    {sweet.quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setShowQuantity(true);
                    }}
                    disabled={sweet.quantity === 0}
                    className="btn btn-success"
                    style={{ flex: 1 }}
                  >
                    Buy Now
                  </button>
                </div>
              )}
            </>
          ) : (
            <>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onEdit?.(sweet);
                }}
                className="btn btn-success"
              >
                Edit
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onDelete?.(sweet._id);
                }}
                className="btn btn-danger"
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    </Link>
  );
};

export default SweetCard;
