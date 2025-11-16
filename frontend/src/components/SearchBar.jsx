import { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [showFilter, setShowFilter] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch({
      name: name || undefined,
      category: category || undefined,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
    });
  };

  const handleReset = () => {
    setName('');
    setCategory('');
    setMinPrice('');
    setMaxPrice('');
    onSearch({});
  };

  return (
    <>
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => setShowFilter(!showFilter)}
          className="btn btn-primary"
          style={{ width: '100%' }}
        >
          {showFilter ? '✕ Close Filter' : '🔍 Open Filter'}
        </button>
      </div>

      {showFilter && (
        <form onSubmit={handleSearch} style={{ 
          backgroundColor: 'white', 
          padding: '20px', 
          borderRadius: '8px',
          border: '1px solid #f5f5f5',
          marginBottom: '30px'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '16px' }}>
            <input
              type="text"
              placeholder="Search by name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-control"
            />
            <input
              type="text"
              placeholder="Filter by category..."
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="form-control"
            />
            <input
              type="number"
              placeholder="Min price..."
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="form-control"
              step="0.01"
            />
            <input
              type="number"
              placeholder="Max price..."
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="form-control"
              step="0.01"
            />
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="submit"
              className="btn btn-primary"
            >
              🔍 Search
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="btn btn-secondary"
            >
              ↺ Reset
            </button>
          </div>
        </form>
      )}
    </>
  );
};

export default SearchBar;
