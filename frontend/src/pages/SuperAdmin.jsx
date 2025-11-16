import { useState, useEffect } from 'react';
import { adminAPI } from '../utils/api';

const SuperAdmin = () => {
  const [activeTab, setActiveTab] = useState('analytics');
  const [showForm, setShowForm] = useState('');
  const [stats, setStats] = useState(null);
  const [discounts, setDiscounts] = useState([]);
  const [banners, setBanners] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [discountForm, setDiscountForm] = useState({
    code: '',
    type: 'percentage',
    value: '',
    minOrderAmount: '',
    maxDiscount: '',
    expiresAt: '',
    usageLimit: '',
  });

  const [bannerForm, setBannerForm] = useState({
    title: '',
    subtitle: '',
    image: '',
    link: '',
    position: 'hero',
    backgroundColor: '#007aff',
    textColor: '#ffffff',
  });

  useEffect(() => {
    if (activeTab === 'analytics') fetchStats();
    if (activeTab === 'promotions') fetchDiscounts();
    if (activeTab === 'marketing') fetchBanners();
    if (activeTab === 'customers') fetchUsers();
  }, [activeTab]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const { data } = await adminAPI.getDashboardStats();
      setStats(data.stats);
    } catch (err) {
      setError('Failed to load business analytics');
    } finally {
      setLoading(false);
    }
  };

  const fetchDiscounts = async () => {
    try {
      const { data } = await adminAPI.getAllDiscounts();
      setDiscounts(data.discounts);
    } catch (err) {
      setError('Failed to load promotional campaigns');
    }
  };

  const fetchBanners = async () => {
    try {
      const { data } = await adminAPI.getAllBanners();
      setBanners(data.banners);
    } catch (err) {
      setError('Failed to load marketing materials');
    }
  };

  const fetchUsers = async () => {
    try {
      const { data } = await adminAPI.getAllUsers();
      setUsers(data.users);
    } catch (err) {
      setError('Failed to load customer database');
    }
  };

  const handleCreateDiscount = async (e) => {
    e.preventDefault();
    try {
      await adminAPI.createDiscount(discountForm);
      setSuccess('Promotional campaign created successfully!');
      setDiscountForm({ code: '', type: 'percentage', value: '', minOrderAmount: '', maxDiscount: '', expiresAt: '', usageLimit: '' });
      setShowForm('');
      fetchDiscounts();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create promotional campaign');
    }
  };

  const handleCreateBanner = async (e) => {
    e.preventDefault();
    try {
      await adminAPI.createBanner(bannerForm);
      setSuccess('Marketing banner deployed successfully!');
      setBannerForm({ title: '', subtitle: '', image: '', link: '', position: 'hero', backgroundColor: '#007aff', textColor: '#ffffff' });
      setShowForm('');
      fetchBanners();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to deploy marketing banner');
    }
  };

  const tabs = [
    { id: 'analytics', label: '📊 Business Analytics', description: 'Revenue & Performance Metrics' },
    { id: 'promotions', label: '🎯 Promotional Campaigns', description: 'Discount Codes & Offers' },
    { id: 'marketing', label: '📢 Marketing Materials', description: 'Banners & Advertisements' },
    { id: 'customers', label: '👥 Customer Management', description: 'User Accounts & Permissions' },
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fafafa', paddingTop: '80px', paddingBottom: '40px' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 className="section-title">Business Operations Center</h1>
          <p style={{ fontSize: '18px', color: '#86868b', marginTop: '10px' }}>
            Comprehensive business management and analytics dashboard
          </p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        {/* Tab Navigation */}
        <div className="admin-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                backgroundColor: activeTab === tab.id ? '#007aff' : '#f2f2f7',
                color: activeTab === tab.id ? 'white' : '#1d1d1f',
                padding: '16px 24px',
                borderRadius: '12px',
                fontSize: '15px',
                fontWeight: '500',
                whiteSpace: 'nowrap',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                minWidth: '180px'
              }}
            >
              <span>{tab.label}</span>
              <span style={{ fontSize: '12px', opacity: 0.8 }}>{tab.description}</span>
            </button>
          ))}
        </div>

        {/* Business Analytics Tab */}
        {activeTab === 'analytics' && (
          <div>
            <h2 style={{ fontSize: '28px', fontWeight: '600', marginBottom: '24px', color: '#1d1d1f' }}>
              📈 Business Performance Dashboard
            </h2>
            {loading ? (
              <div className="loading"><div className="spinner"></div></div>
            ) : stats ? (
              <div className="admin-stats-grid">
                <div style={{ background: 'white', padding: '32px', borderRadius: '16px', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: '2px solid #007aff20' }}>
                  <div style={{ fontSize: '48px', marginBottom: '8px' }}>📊</div>
                  <h3 style={{ fontSize: '36px', color: '#007aff', margin: '0 0 8px 0', fontWeight: '700' }}>{stats.totalOrders}</h3>
                  <p style={{ color: '#86868b', margin: 0, fontSize: '16px', fontWeight: '500' }}>Total Orders Processed</p>
                </div>
                <div style={{ background: 'white', padding: '32px', borderRadius: '16px', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: '2px solid #34c75920' }}>
                  <div style={{ fontSize: '48px', marginBottom: '8px' }}>💰</div>
                  <h3 style={{ fontSize: '36px', color: '#34c759', margin: '0 0 8px 0', fontWeight: '700' }}>₹{stats.totalRevenue.toFixed(2)}</h3>
                  <p style={{ color: '#86868b', margin: 0, fontSize: '16px', fontWeight: '500' }}>Total Revenue Generated</p>
                </div>
                <div style={{ background: 'white', padding: '32px', borderRadius: '16px', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: '2px solid #ff950020' }}>
                  <div style={{ fontSize: '48px', marginBottom: '8px' }}>🍰</div>
                  <h3 style={{ fontSize: '36px', color: '#ff9500', margin: '0 0 8px 0', fontWeight: '700' }}>{stats.totalSweets}</h3>
                  <p style={{ color: '#86868b', margin: 0, fontSize: '16px', fontWeight: '500' }}>Products in Catalog</p>
                </div>
                <div style={{ background: 'white', padding: '32px', borderRadius: '16px', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: '2px solid #ff3b3020' }}>
                  <div style={{ fontSize: '48px', marginBottom: '8px' }}>⚠️</div>
                  <h3 style={{ fontSize: '36px', color: '#ff3b30', margin: '0 0 8px 0', fontWeight: '700' }}>{stats.lowStockSweets}</h3>
                  <p style={{ color: '#86868b', margin: 0, fontSize: '16px', fontWeight: '500' }}>Low Inventory Alerts</p>
                </div>
              </div>
            ) : null}
          </div>
        )}

        {/* Promotional Campaigns Tab */}
        {activeTab === 'promotions' && (
          <div>
            <h2 style={{ fontSize: '28px', fontWeight: '600', marginBottom: '24px', color: '#1d1d1f' }}>
              🎯 Promotional Campaign Management
            </h2>
            
            {showForm !== 'discount' ? (
              <button
                onClick={() => setShowForm('discount')}
                className="btn btn-primary"
                style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                ➕ Create New Promotional Campaign
              </button>
            ) : (
              <div style={{ background: 'white', padding: '32px', borderRadius: '16px', marginBottom: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    ➕ Create New Promotional Campaign
                  </h3>
                  <button
                    onClick={() => setShowForm('')}
                    style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}
                  >
                    ✕
                  </button>
                </div>
                <form onSubmit={handleCreateDiscount}>
                  <div className="admin-form-grid">
                    <input
                      type="text"
                      placeholder="Promotion Code (e.g., SAVE20)"
                      value={discountForm.code}
                      onChange={(e) => setDiscountForm({ ...discountForm, code: e.target.value.toUpperCase() })}
                      className="form-control"
                      required
                    />
                    <select
                      value={discountForm.type}
                      onChange={(e) => setDiscountForm({ ...discountForm, type: e.target.value })}
                      className="form-control"
                    >
                      <option value="percentage">Percentage Discount</option>
                      <option value="fixed">Fixed Amount Discount</option>
                    </select>
                    <input
                      type="number"
                      placeholder="Discount Value"
                      value={discountForm.value}
                      onChange={(e) => setDiscountForm({ ...discountForm, value: e.target.value })}
                      className="form-control"
                      required
                    />
                    <input
                      type="number"
                      placeholder="Minimum Order Value"
                      value={discountForm.minOrderAmount}
                      onChange={(e) => setDiscountForm({ ...discountForm, minOrderAmount: e.target.value })}
                      className="form-control"
                    />
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    🚀 Launch Campaign
                  </button>
                </form>
              </div>
            )}

            <div className="grid-responsive">
              {discounts.map((discount) => (
                <div key={discount._id} style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: '2px solid #007aff20' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <span style={{ fontSize: '24px' }}>🎫</span>
                    <h3 style={{ margin: '0', color: '#007aff', fontSize: '18px', fontWeight: '600' }}>{discount.code}</h3>
                  </div>
                  <p style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: '500' }}>
                    {discount.type === 'percentage' ? `${discount.value}% OFF` : `₹${discount.value} OFF`}
                  </p>
                  <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#86868b' }}>
                    Minimum Order: ₹{discount.minOrderAmount}
                  </p>
                  <p style={{ margin: '0 0 20px 0', fontSize: '14px', color: '#86868b' }}>
                    Campaign Usage: {discount.usedCount} customers
                  </p>
                  <button
                    onClick={() => adminAPI.deleteDiscount(discount._id).then(fetchDiscounts)}
                    className="btn btn-danger"
                    style={{ fontSize: '14px', padding: '8px 16px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                  >
                    🗑️ Terminate Campaign
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Marketing Materials Tab */}
        {activeTab === 'marketing' && (
          <div>
            <h2 style={{ fontSize: '28px', fontWeight: '600', marginBottom: '24px', color: '#1d1d1f' }}>
              📢 Marketing Materials Management
            </h2>
            
            {showForm !== 'banner' ? (
              <button
                onClick={() => setShowForm('banner')}
                className="btn btn-primary"
                style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                🎨 Create Marketing Banner
              </button>
            ) : (
              <div style={{ background: 'white', padding: '32px', borderRadius: '16px', marginBottom: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    🎨 Create Marketing Banner
                  </h3>
                  <button
                    onClick={() => setShowForm('')}
                    style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}
                  >
                    ✕
                  </button>
                </div>
                <form onSubmit={handleCreateBanner}>
                  <div className="admin-form-grid">
                    <input
                      type="text"
                      placeholder="Campaign Title"
                      value={bannerForm.title}
                      onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })}
                      className="form-control"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Campaign Subtitle"
                      value={bannerForm.subtitle}
                      onChange={(e) => setBannerForm({ ...bannerForm, subtitle: e.target.value })}
                      className="form-control"
                    />
                    <input
                      type="url"
                      placeholder="Banner Image URL"
                      value={bannerForm.image}
                      onChange={(e) => setBannerForm({ ...bannerForm, image: e.target.value })}
                      className="form-control"
                      required
                    />
                    <select
                      value={bannerForm.position}
                      onChange={(e) => setBannerForm({ ...bannerForm, position: e.target.value })}
                      className="form-control"
                    >
                      <option value="hero">Hero Section</option>
                      <option value="middle">Content Section</option>
                      <option value="footer">Footer Section</option>
                    </select>
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    📡 Deploy Banner
                  </button>
                </form>
              </div>
            )}

            <div className="grid-responsive">
              {banners.map((banner) => (
                <div key={banner._id} style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: '2px solid #34c75920' }}>
                  <img src={banner.image} alt={banner.title} style={{ width: '100%', height: '140px', objectFit: 'cover' }} />
                  <div style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <span style={{ fontSize: '20px' }}>🖼️</span>
                      <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '600' }}>{banner.title}</h3>
                    </div>
                    <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#86868b' }}>{banner.subtitle}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                      <span style={{ fontSize: '16px' }}>{banner.isActive ? '🟢' : '🔴'}</span>
                      <p style={{ margin: '0', fontSize: '12px', color: banner.isActive ? '#34c759' : '#ff3b30', fontWeight: '500' }}>
                        {banner.isActive ? 'Live Campaign' : 'Inactive Campaign'}
                      </p>
                    </div>
                    <button
                      onClick={() => adminAPI.deleteBanner(banner._id).then(fetchBanners)}
                      className="btn btn-danger"
                      style={{ fontSize: '14px', padding: '8px 16px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                    >
                      🗑️ Remove Banner
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Customer Management Tab */}
        {activeTab === 'customers' && (
          <div>
            <h2 style={{ fontSize: '28px', fontWeight: '600', marginBottom: '24px', color: '#1d1d1f' }}>
              👥 Customer Relationship Management
            </h2>
            <div className="admin-table-container">
              <div style={{ padding: '24px', borderBottom: '1px solid #f2f2f7', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '32px' }}>📊</span>
                <div>
                  <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '600' }}>Customer Database</h3>
                  <p style={{ margin: 0, fontSize: '14px', color: '#86868b' }}>Manage user accounts and access permissions</p>
                </div>
              </div>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>👤 Customer Email</th>
                    <th>🏷️ Account Type</th>
                    <th>📅 Registration Date</th>
                    <th>⚙️ Account Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td style={{ fontWeight: '500' }}>{user.email}</td>
                      <td>
                        <span style={{
                          padding: '6px 12px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '600',
                          backgroundColor: user.role === 'admin' ? '#ff3b30' : '#007aff',
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          width: 'fit-content'
                        }}>
                          {user.role === 'admin' ? '👑' : '👤'} {user.role === 'admin' ? 'Administrator' : 'Customer'}
                        </span>
                      </td>
                      <td style={{ color: '#86868b' }}>
                        {new Date(user.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          <button
                            onClick={() => adminAPI.updateUserRole(user._id, user.role === 'admin' ? 'user' : 'admin').then(fetchUsers)}
                            className="btn btn-secondary"
                            style={{ fontSize: '12px', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '4px' }}
                          >
                            🔄 Change Role
                          </button>
                          <button
                            onClick={() => adminAPI.deleteUser(user._id).then(fetchUsers)}
                            className="btn btn-danger"
                            style={{ fontSize: '12px', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '4px' }}
                          >
                            🗑️ Remove Account
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuperAdmin;