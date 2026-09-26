import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import PublicNavbar from '../../components/PublicNavbar';

export default function AdminRegister() {
  const { register } = useAdminAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    tuitionClassName: '',
    adminName: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app-shell">
      <PublicNavbar />
      <div className="centered-page">
      <div className="sheet-card auth-card">
        <span className="auth-eyebrow">New tuition class</span>
        <h1>Register your class</h1>
        <p className="muted text-sm">
          This creates your tuition class and your admin account together.
        </p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="tuitionClassName">Tuition class name</label>
            <input
              id="tuitionClassName"
              value={form.tuitionClassName}
              onChange={(e) => updateField('tuitionClassName', e.target.value)}
              placeholder="ABC Tuition"
              required
            />
          </div>
          <div className="field">
            <label htmlFor="adminName">Your name</label>
            <input
              id="adminName"
              value={form.adminName}
              onChange={(e) => updateField('adminName', e.target.value)}
              placeholder="Kasun Perera"
              required
            />
          </div>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => updateField('email', e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={form.password}
              onChange={(e) => updateField('password', e.target.value)}
              placeholder="At least 8 characters"
              required
            />
          </div>
          <button type="submit" className="btn btn-accent btn-block" disabled={loading}>
            {loading ? 'Creating your class...' : 'Register'}
          </button>
        </form>

        <p className="text-sm spacer-top">
          Already have a class? <Link to="/admin/login">Log in</Link>
        </p>
      </div>
      </div>
    </div>
  );
}
