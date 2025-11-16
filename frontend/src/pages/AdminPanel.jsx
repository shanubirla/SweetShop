import { useState, useEffect } from 'react';
import { sweetsAPI } from '../utils/api';

const AdminPanel = () => {
  const [sweets, setSweets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [filters, setFilters] = useState({ category: '', minPrice: '', maxPrice: '' });
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    quantity: '',
    image: '',
  });

  const categories = ['Gulab Jamun', 'Rasgulla', 'Jalebi', 'Barfi', 'Laddu', 'Kheer', 'Halwa', 'Fafda', 'Other'];

  useEffect(() => {
    fetchSweets();
  }, []);

  const fetchSweets = async () => {
    try {
      setLoading(true);
      const { data } = await sweetsAPI.getAllSweets();
      setSweets(data.sweets);
    } catch {
      setError('Failed to load sweets');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (parseFloat(formData.quantity) < 0) {
      setError('Quantity cannot be negative');
      return;
    }

    const submitData = {
      name: formData.name,
      category: formData.category,
      price: parseFloat(formData.price),
      quantity: parseInt(formData.quantity),
      image: formData.image || '',
    };

    try {
      if (editId) {
        await sweetsAPI.updateSweet(editId, submitData);
        setSuccessMessage('Sweet updated successfully!');
      } else {
        await sweetsAPI.createSweet(submitData);
        setSuccessMessage('Sweet created successfully!');
      }
      setFormData({ name: '', category: '', price: '', quantity: '', image: '' });
      setEditId(null);
      setShowModal(false);
      await fetchSweets();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save sweet');
    }
  };

  const handleEdit = (sweet) => {
    setFormData({
      name: sweet.name,
      category: sweet.category,
      price: sweet.price,
      quantity: sweet.quantity,
      image: sweet.image || '',
    });
    setEditId(sweet._id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure?')) {
      try {
        await sweetsAPI.deleteSweet(id);
        setSuccessMessage('Sweet deleted successfully!');
        await fetchSweets();
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to delete sweet');
      }
    }
  };

  const handleRestock = async (id) => {
    const quantity = prompt('Enter restock quantity:');
    if (quantity && parseInt(quantity) >= 0) {
      try {
        await sweetsAPI.restockSweet(id, parseInt(quantity));
        setSuccessMessage('Restock successful!');
        await fetchSweets();
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to restock');
      }
    } else if (quantity) {
      setError('Quantity cannot be negative');
    }
  };

  const filteredSweets = sweets.filter(sweet => {
    if (filters.category && sweet.category !== filters.category) return false;
    if (filters.minPrice && sweet.price < parseFloat(filters.minPrice)) return false;
    if (filters.maxPrice && sweet.price > parseFloat(filters.maxPrice)) return false;
    return true;
  });

  const closeModal = () => {
    setShowModal(false);
    setEditId(null);
    setFormData({ name: '', category: '', price: '', quantity: '', image: '' });
    setError('');
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #FFF9F5 0%, #F5FFFE 100%)', paddingTop: '80px', paddingBottom: '40px' }}>
      <div className="container">
        <h1 className="section-title">Inventory Management</h1>

        {error && <div className="alert alert-error">{error}</div>}
        {successMessage && <div className="alert alert-success">{successMessage}</div>}

        <div style={{ marginBottom: '32px', textAlign: 'center' }}>
          <button
            onClick={() => setShowModal(true)}
            className="btn btn-primary"
            style={{ fontSize: '16px', padding: '14px 32px' }}
          >
            + Add New Sweet
          </button>
        </div>

        {showModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '32px',
              maxWidth: '500px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: '#2c2c2c' }}>
                  {editId ? 'Edit Sweet' : 'Add New Sweet'}
                </h2>
                <button
                  onClick={closeModal}
                  style={{ background: 'none', border: 'none', fontSize: '28px', cursor: 'pointer', color: '#999' }}
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Sweet Name *</label>
                  <input
                    type="text"
                    placeholder="e.g., Gulab Jamun"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                    className="form-control"
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Price (₹) *</label>
                    <input
                      type="number"
                      placeholder="0.00"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                      step="0.01"
                      min="0"
                      className="form-control"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Quantity *</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={formData.quantity}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === '' || parseInt(val) >= 0) {
                          setFormData({ ...formData, quantity: val });
                        }
                      }}
                      required
                      min="0"
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Image URL (Optional)</label>
                  <input
                    type="text"
                    placeholder="https://example.com/image.jpg"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="form-control"
                  />
                  <p style={{ fontSize: '12px', color: '#999', marginTop: '8px' }}>Paste image URL and it will display below</p>
                  {formData.image && (
                    <div style={{ marginTop: '12px', borderRadius: '12px', overflow: 'hidden', maxHeight: '150px', background: '#f5f5f5' }}>
                      <img
                        src={formData.image}
                        alt="Preview"
                        style={{ width: '100%', height: '150px', objectFit: 'cover', display: 'block' }}
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '28px' }}>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                    {editId ? 'Update Sweet' : 'Create Sweet'}
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="btn btn-secondary"
                    style={{ flex: 1 }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '16px',
          marginBottom: '32px',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)',
          border: '2px solid #A8E6CF'
        }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '700', color: '#2c2c2c' }}>
            Filter Inventory
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div>
              <label className="form-label">Category</label>
              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="form-control"
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="form-label">Min Price (₹)</label>
              <input
                type="number"
                placeholder="0"
                value={filters.minPrice}
                onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                min="0"
                className="form-control"
              />
            </div>

            <div>
              <label className="form-label">Max Price (₹)</label>
              <input
                type="number"
                placeholder="1000"
                value={filters.maxPrice}
                onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                min="0"
                className="form-control"
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button
                onClick={() => setFilters({ category: '', minPrice: '', maxPrice: '' })}
                className="btn btn-secondary"
                style={{ width: '100%' }}
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="loading"><div className="spinner"></div></div>
        ) : filteredSweets.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#2c2c2c' }}>
            <p style={{ fontSize: '18px', fontWeight: '700' }}>No sweets found matching your filters</p>
          </div>
        ) : (
          <div className="grid grid-4">
            {filteredSweets.map((sweet) => (
              <div key={sweet._id} style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                border: '2px solid #A8E6CF',
                transition: 'all 0.3s ease'
              }}>
                {sweet.image ? (
                  <img
                    src={sweet.image}
                    alt={sweet.name}
                    style={{ width: '100%', height: '180px', objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                ) : (
                  <div style={{
                    width: '100%',
                    height: '180px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '48px',
                    background: 'linear-gradient(135deg, #FFE5F0 0%, #E5F5F0 100%)',
                    color: '#A8E6CF',
                    fontWeight: '300',
                    letterSpacing: '2px'
                  }}>
                    ◆
                  </div>
                )}
                <div style={{ padding: '16px' }}>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '700', color: '#2c2c2c' }}>{sweet.name}</h3>
                  <p style={{ margin: '0 0 8px 0', color: '#2c2c2c', fontSize: '14px', fontWeight: '600' }}>{sweet.category}</p>
                  <p style={{ margin: '0 0 12px 0', fontSize: '20px', fontWeight: '700', color: '#A8E6CF' }}>₹{sweet.price.toFixed(2)}</p>
                  <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#2c2c2c', fontWeight: '600' }}>Stock: {sweet.quantity}</p>

                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => handleEdit(sweet)}
                      className="btn btn-secondary"
                      style={{ flex: 1, fontSize: '13px', padding: '8px 12px', minWidth: '70px' }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleRestock(sweet._id)}
                      className="btn btn-primary"
                      style={{ flex: 1, fontSize: '13px', padding: '8px 12px', minWidth: '70px' }}
                    >
                      Restock
                    </button>
                    <button
                      onClick={() => handleDelete(sweet._id)}
                      className="btn btn-danger"
                      style={{ flex: 1, fontSize: '13px', padding: '8px 12px', minWidth: '70px' }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
