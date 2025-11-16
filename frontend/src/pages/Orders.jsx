import { useState, useEffect } from 'react';
import { orderAPI, sweetsAPI } from '../utils/api';
import BillGenerator from '../components/BillGenerator';

const Orders = ({ user }) => {
  const [orders, setOrders] = useState([]);
  const [sweets, setSweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedOrderForBill, setSelectedOrderForBill] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [ordersRes, sweetsRes] = await Promise.all([
        user?.role === 'admin' ? orderAPI.getAllOrders() : orderAPI.getOrders(),
        sweetsAPI.getAllSweets()
      ]);
      setOrders(ordersRes.data.orders);
      setSweets(sweetsRes.data.sweets);
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      await orderAPI.updateOrderStatus(orderId, newStatus);
      setSuccess(`Order status updated to ${newStatus.toUpperCase()} successfully!`);
      await fetchData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update order status');
    }
  };

  const cancelOrder = async (orderId) => {
    try {
      await orderAPI.cancelOrder(orderId);
      setSuccess('Order cancelled successfully! Stock has been restored.');
      await fetchData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to cancel order');
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      pending: { color: '#ff9500', icon: '⏳', label: 'Order Received' },
      confirmed: { color: '#007aff', icon: '✅', label: 'Order Confirmed' },
      preparing: { color: '#af52de', icon: '👨🍳', label: 'In Preparation' },
      ready: { color: '#34c759', icon: '📦', label: 'Ready for Pickup' },
      delivered: { color: '#00d4aa', icon: '🚚', label: 'Successfully Delivered' },
      cancelled: { color: '#ff3b30', icon: '❌', label: 'Order Cancelled' },
    };
    return configs[status] || { color: '#86868b', icon: '❓', label: 'Unknown Status' };
  };

  const canCancelOrder = (order) => {
    return ['pending', 'confirmed'].includes(order.status);
  };

  if (selectedOrderForBill) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #FFF9F5 0%, #F5FFFE 100%)', paddingTop: '80px', paddingBottom: '40px' }}>
        <div className="container">
          <button
            onClick={() => setSelectedOrderForBill(null)}
            className="btn btn-secondary"
            style={{ marginBottom: '20px' }}
          >
            Back to Orders
          </button>
          <BillGenerator order={selectedOrderForBill} sweets={sweets} />
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #FFF9F5 0%, #F5FFFE 100%)', paddingTop: '80px', paddingBottom: '40px' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 className="section-title">
            {user?.role === 'admin' ? 'Order Management System' : 'Order History & Tracking'}
          </h1>
          <p style={{ fontSize: '18px', color: '#2c2c2c', marginTop: '10px', fontWeight: '600' }}>
            {user?.role === 'admin' 
              ? 'Comprehensive order processing and fulfillment dashboard'
              : 'Track your orders and view purchase history'
            }
          </p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <span>Loading order records...</span>
          </div>
        ) : orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', color: '#2c2c2c' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>📋</div>
            <h3 style={{ fontSize: '24px', marginBottom: '8px', color: '#2c2c2c', fontWeight: '700' }}>No Orders Found</h3>
            <p style={{ fontWeight: '600' }}>No order records available at this time</p>
          </div>
        ) : (
          <div className="grid-responsive">
            {orders.map((order) => {
              const statusConfig = getStatusConfig(order.status);
              return (
                <div key={order._id} style={{ 
                  backgroundColor: 'white', 
                  borderRadius: '16px', 
                  padding: '24px', 
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  border: `2px solid ${statusConfig.color}40`
                }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'flex-start',
                    marginBottom: '20px',
                    flexWrap: 'wrap',
                    gap: '16px'
                  }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <span style={{ fontSize: '20px' }}>🧾</span>
                        <p style={{ fontSize: '12px', color: '#2c2c2c', margin: 0, fontWeight: '700' }}>ORDER REFERENCE</p>
                      </div>
                      <p style={{ margin: '0', fontWeight: '700', fontSize: '16px', fontFamily: 'monospace', color: '#2c2c2c' }}>
                        #{order._id.slice(-8).toUpperCase()}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', justifyContent: 'flex-end' }}>
                        <span style={{ fontSize: '20px' }}>📊</span>
                        <p style={{ fontSize: '12px', color: '#2c2c2c', margin: 0, fontWeight: '700' }}>ORDER STATUS</p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '18px' }}>{statusConfig.icon}</span>
                        <span style={{
                          padding: '8px 16px',
                          borderRadius: '12px',
                          fontSize: '13px',
                          fontWeight: '700',
                          backgroundColor: statusConfig.color,
                          color: 'white',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}>
                          {statusConfig.label}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', 
                    gap: '20px', 
                    marginBottom: '20px',
                    padding: '20px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '12px'
                  }}>
                    <div style={{ textAlign: 'center' }}>
                      <p style={{ fontSize: '12px', color: '#2c2c2c', margin: '0 0 4px 0', fontWeight: '700' }}>TOTAL AMOUNT</p>
                      <p style={{ margin: '0', fontWeight: '700', fontSize: '20px', color: '#A8E6CF' }}>
                        ₹{order.totalAmount.toFixed(2)}
                      </p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <p style={{ fontSize: '12px', color: '#2c2c2c', margin: '0 0 4px 0', fontWeight: '700' }}>ORDER DATE</p>
                      <p style={{ margin: '0', fontSize: '14px', fontWeight: '700', color: '#2c2c2c' }}>
                        {new Date(order.createdAt).toLocaleDateString('en-IN')}
                      </p>
                    </div>
                  </div>

                  <div style={{ marginBottom: '24px' }}>
                    <p style={{ fontSize: '16px', fontWeight: '700', margin: '0 0 12px 0', color: '#2c2c2c' }}>Items:</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {order.items.map((item, idx) => (
                        <div key={idx} style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between',
                          padding: '8px 12px',
                          backgroundColor: '#f8f9fa',
                          borderRadius: '8px',
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#2c2c2c'
                        }}>
                          <span>{item.name} × {item.quantity}</span>
                          <span style={{ fontWeight: '700', color: '#A8E6CF' }}>₹{(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedOrderForBill(order)}
                    className="btn btn-primary"
                    style={{ width: '100%', marginBottom: '12px' }}
                  >
                    View & Download Bill
                  </button>

                  {user?.role === 'admin' && (
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {['pending', 'confirmed', 'preparing', 'ready', 'delivered'].map((status) => (
                        <button
                          key={status}
                          onClick={() => updateStatus(order._id, status)}
                          disabled={order.status === status}
                          className="btn btn-secondary"
                          style={{ flex: 1, fontSize: '12px', padding: '8px 12px', minWidth: '80px', opacity: order.status === status ? 0.5 : 1 }}
                        >
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                      ))}
                    </div>
                  )}

                  {canCancelOrder(order) && (
                    <button
                      onClick={() => cancelOrder(order._id)}
                      className="btn btn-danger"
                      style={{ width: '100%', marginTop: '12px' }}
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
