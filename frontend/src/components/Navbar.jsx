import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ user, onLogout, cartCount = 0 }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <nav>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
           
            <h1>The Mithai Box</h1>
          </Link>

          <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            {user ? (
              <>
                <span style={{ fontSize: '14px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {user.email}
                </span>
                {user.role !== 'admin' && (
                  <Link to="/orders" style={{ textDecoration: 'none', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    Orders
                  </Link>
                )}
                {user.role !== 'admin' && (
                  <Link to="/cart" style={{ textDecoration: 'none', position: 'relative', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    Cart
                    {cartCount > 0 && (
                      <span style={{
                        position: 'absolute',
                        top: '-8px',
                        right: '-8px',
                        background: 'linear-gradient(135deg, #A8E6CF 0%, #7FE5D9 100%)',
                        color: 'white',
                        borderRadius: '50%',
                        width: '20px',
                        height: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        boxShadow: '0 2px 8px rgba(168, 230, 207, 0.3)',
                      }}>
                        {cartCount}
                      </span>
                    )}
                  </Link>
                )}
                {user.role === 'admin' && (
                  <Link to="/admin" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    Inventory
                  </Link>
                )}
                {user.role === 'admin' && (
                  <Link to="/super-admin" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    Operations
                  </Link>
                )}
                {user.role === 'admin' && (
                  <Link to="/orders" style={{ textDecoration: 'none', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    Orders
                  </Link>
                )}
                <button onClick={handleLogout} className="btn btn-danger" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-primary" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', margin: 0 }}>
                  Sign In
                </Link>
                <Link to="/register" className="btn btn-primary" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', margin: 0 }}>
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
