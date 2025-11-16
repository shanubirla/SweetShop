import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { orderAPI } from '../utils/api';

const Cart = () => {
  const navigate = useNavigate();
  const { cart, updateCartItem, removeFromCart, getCartTotal, clearCart } = useCart();
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setError('Please enter a coupon code');
      return;
    }

    try {
      const { data } = await orderAPI.validateDiscount(couponCode, total);
      setDiscount(data.discountAmount);
      setSuccess(`✅ Coupon applied! Discount: ₹${data.discountAmount.toFixed(2)}`);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid coupon code');
      setDiscount(0);
    }
  };

  const handleCheckout = async () => {
    if (!deliveryAddress.trim()) {
      setError('Please enter delivery address');
      return;
    }

    setLoading(true);
    try {
      await orderAPI.createOrder(deliveryAddress, notes, couponCode || undefined);
      setSuccess('Order placed successfully!');
      await clearCart();
      setTimeout(() => navigate('/orders'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (!cart) return <div>Loading...</div>;

  const total = getCartTotal();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5', paddingTop: '80px', paddingBottom: '40px' }}>
      <div className="container">
        <h1 className="section-title">Shopping Cart</h1>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
          {/* Cart Items */}
          <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '20px' }}>
            {cart.items.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#666', padding: '40px' }}>Your cart is empty</p>
            ) : (
              <>
                {cart.items.map((item) => (
                  <div key={item.sweetId} style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: '15px', marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ margin: '0 0 5px 0', fontSize: '16px' }}>{item.sweetId.name}</h3>
                      <p style={{ margin: '0', color: '#666', fontSize: '14px' }}>₹{item.price} × {item.quantity}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <button
                        onClick={() => updateCartItem(item.sweetId._id, item.quantity - 1)}
                        className="btn"
                        style={{ padding: '5px 10px', fontSize: '12px' }}
                      >
                        −
                      </button>
                      <span style={{ minWidth: '30px', textAlign: 'center' }}>{item.quantity}</span>
                      <button
                        onClick={() => updateCartItem(item.sweetId._id, item.quantity + 1)}
                        className="btn"
                        style={{ padding: '5px 10px', fontSize: '12px' }}
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeFromCart(item.sweetId._id)}
                        className="btn btn-danger"
                        style={{ padding: '5px 10px', fontSize: '12px' }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>

          {/* Checkout */}
          <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '20px', height: 'fit-content' }}>
            <h2 style={{ fontSize: '18px', marginBottom: '20px' }}>Order Summary</h2>

            <div style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #f0f0f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span>Subtotal</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span>Delivery</span>
                <span>Free</span>
              </div>
              {discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: '#FF6B9D' }}>
                  <span>Discount</span>
                  <span>-₹{discount.toFixed(2)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 'bold', color: '#FF6B9D' }}>
                <span>Total</span>
                <span>₹{(total - discount).toFixed(2)}</span>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Coupon Code (Optional)</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  className="form-control"
                  placeholder="Enter coupon code"
                  style={{ flex: 1 }}
                />
                <button
                  onClick={handleApplyCoupon}
                  className="btn btn-primary"
                  style={{ padding: '12px 16px' }}
                >
                  Apply
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Delivery Address</label>
              <textarea
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                className="form-control"
                rows="3"
                placeholder="Enter your delivery address"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Special Instructions (Optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="form-control"
                rows="2"
                placeholder="Any special requests?"
              />
            </div>

            <button
              onClick={handleCheckout}
              disabled={loading || cart.items.length === 0}
              className="btn btn-primary"
              style={{ width: '100%', padding: '12px', marginTop: '12px' }}
            >
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
