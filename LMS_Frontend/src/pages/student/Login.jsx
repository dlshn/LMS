import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStudentAuth } from '../../context/StudentAuthContext';
import PublicNavbar from '../../components/PublicNavbar';

export default function StudentLogin() {
  const { login } = useStudentAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login({ username, password });
      navigate('/student/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Check your username and password.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app-shell">
      <PublicNavbar />
      <div className="centered-page">
      <div className="sheet-card auth-card">
        <span className="auth-eyebrow">Student</span>
        <h1>Log in</h1>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
              required
            />
          </div>
          <button type="submit" className="btn btn-accent btn-block" disabled={loading}>
            {loading ? 'Logging in...' : 'Log in'}
          </button>
        </form>

        <p className="text-sm spacer-top">
          New here? <Link to="/student/register">Create your account</Link>
        </p>
        <p className="text-sm">
          Tuition admin? <Link to="/admin/login">Log in here</Link>
        </p>
      </div>
      </div>
    </div>
  );
}
