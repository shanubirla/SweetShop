import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../utils/api';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (loginType) => {
    setError('');
    setLoading(true);

    try {
      const { data } = loginType === 'admin' 
        ? await authAPI.loginAdmin(email, password)
        : await authAPI.loginUser(email, password);
      
      onLogin(data.user, data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #FFF9F5 0%, #F5FFFE 100%)', paddingTop: '60px' }}>
      <div className="form-container">
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h2 style={{ color: '#2c2c2c', fontSize: '32px', marginBottom: '10px', fontWeight: '700' }}>Welcome Back</h2>
          <p style={{ color: '#2c2c2c', fontWeight: '600' }}>Sign in to your Sweet Heaven account</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-control"
              placeholder="your@email.com"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-control"
              placeholder="••••••••"
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button
              type="button"
              onClick={() => handleLogin('user')}
              disabled={loading || !email || !password}
              className="btn btn-primary"
              style={{ flex: 1 }}
            >
              {loading ? 'Signing in...' : 'Login as User'}
            </button>
            <button
              type="button"
              onClick={() => handleLogin('admin')}
              disabled={loading || !email || !password}
              className="btn btn-secondary"
              style={{ flex: 1 }}
            >
              {loading ? 'Signing in...' : 'Login as Admin'}
            </button>
          </div>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px', color: '#2c2c2c', fontWeight: '600' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#A8E6CF', fontWeight: '700', textDecoration: 'none' }}>
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
