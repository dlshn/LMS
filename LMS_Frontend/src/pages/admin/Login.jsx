import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import PublicNavbar from '../../components/PublicNavbar';

export default function AdminLogin() {
  const { login } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [notice] = useState(location.state?.notice || '');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await login({ email, password });
      navigate(data.admin?.role === 'SUPER_ADMIN' ? '/super/classes' : '/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Check your email and password.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app-shell">
      <PublicNavbar />
      <div className="centered-page">
      <div className="sheet-card auth-card">
        <span className="auth-eyebrow">Tuition admin</span>
        <h1>Log in</h1>

        {notice && <div className="alert alert-success">{notice}</div>}
        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              required
            />
          </div>
          <button type="submit" className="btn btn-accent btn-block" disabled={loading}>
            {loading ? 'Logging in...' : 'Log in'}
          </button>
        </form>

        <p className="text-sm spacer-top">
          New tuition class? <Link to="/admin/register">Register here</Link>
        </p>
        
      </div>
      </div>
    </div>
  );
}
