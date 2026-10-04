import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import PublicNavbar from '../../components/PublicNavbar';
import { IconEye, IconEyeOff } from '../../components/icons';

export default function AdminRegister() {
  const { register } = useAdminAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    tuitionClassName: '',
    adminName: '',
    phone: '',
    subject: '',
    classType: 'PHYSICAL',
    email: '',
    password: '',
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (form.password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

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
            <label htmlFor="phone">Your mobile number</label>
            <input
              id="phone"
              type="tel"
              value={form.phone}
              onChange={(e) => updateField('phone', e.target.value)}
              placeholder="07X XXX XXXX"
              required
            />
          </div>
          <div className="field">
            <label htmlFor="subject">Subject</label>
            <input
              id="subject"
              value={form.subject}
              onChange={(e) => updateField('subject', e.target.value)}
              placeholder="Mathematics"
              required
            />
          </div>
          <div className="field">
            <label htmlFor="classType">Class type</label>
            <select
              id="classType"
              value={form.classType}
              onChange={(e) => updateField('classType', e.target.value)}
              required
            >
              <option value="PHYSICAL">Physical</option>
              <option value="ONLINE">Online</option>
            </select>
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
            <div className="password-field">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={(e) => updateField('password', e.target.value)}
                placeholder="At least 8 characters"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <IconEyeOff /> : <IconEye />}
              </button>
            </div>
          </div>
          <div className="field">
            <label htmlFor="confirmPassword">Confirm password</label>
            <div className="password-field">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword((s) => !s)}
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? <IconEyeOff /> : <IconEye />}
              </button>
            </div>
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
