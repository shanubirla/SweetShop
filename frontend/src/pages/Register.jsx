import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../utils/api';

const Register = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await authAPI.register(email, password, role);
      setSuccess('Account created successfully! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #FFF9F5 0%, #F5FFFE 100%)', paddingTop: '60px' }}>
      <div className="form-container">
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h2 style={{ color: '#2c2c2c', fontSize: '32px', marginBottom: '10px', fontWeight: '700' }}>Join Sweet Heaven</h2>
          <p style={{ color: '#2c2c2c', fontWeight: '600' }}>Create your account to start shopping</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

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

          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="form-control"
              placeholder="••••••••"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Register as</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="form-control"
              style={{ cursor: 'pointer' }}
            >
              <option value="user">Customer</option>
              <option value="admin">Shop Manager (Admin)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '20px' }}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px', color: '#2c2c2c', fontWeight: '600' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#A8E6CF', fontWeight: '700', textDecoration: 'none' }}>
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
