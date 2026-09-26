import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStudentAuth } from '../../context/StudentAuthContext';
import PublicNavbar from '../../components/PublicNavbar';
import { IconEye, IconEyeOff } from '../../components/icons';

const emptyForm = {
  studentNumber: '',
  joinCode: '',
  username: '',
  password: '',
  phone: '',
  school: '',
  parentPhone: '',
};

export default function StudentRegister() {
  const { registerSelf } = useStudentAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [showPassword, setShowPassword] = useState(false);
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
      await registerSelf(form);
      navigate('/student/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Could not complete registration. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app-shell">
      <PublicNavbar />
      <div className="centered-page">
        <div className="sheet-card auth-card" style={{ maxWidth: 460 }}>
          <span className="auth-eyebrow">Student</span>
          <h1>Student Register</h1>
          <p className="muted text-sm">
            Student number සහ Class join code එක ඔබගේ ගුරුවරයා විසින් ඔබට ලබාදෙනු ඇත.<br />
            ඔබ ලබාදෙන <b>username</b> සහ <b>password</b> එක ඔබ මතකයේ තබා ගත යුතුය.
          </p>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            {/* These two come from the admin, not chosen by the student — kept
                visually separate from the fields below so it's clear where to
                look when something's copied wrong. */}
            <div className="admin-provided">
              <span className="admin-provided-label">Given by your admin</span>
              <div className="field">
                <label htmlFor="studentNumber">Student number</label>
                <input
                  id="studentNumber"
                  value={form.studentNumber}
                  onChange={(e) => updateField('studentNumber', e.target.value)}
                  placeholder="S001"
                  required
                />
              </div>
              <div className="field" style={{ marginBottom: 0 }}>
                <label htmlFor="joinCode">Class join code</label>
                <input
                  id="joinCode"
                  value={form.joinCode}
                  onChange={(e) => updateField('joinCode', e.target.value)}
                  placeholder="ABC123"
                  required
                />
              </div>
            </div>

            <div className="field">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                value={form.username}
                onChange={(e) => updateField('username', e.target.value)}
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
                  placeholder="At least 6 characters"
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
              <label htmlFor="phone">Your mobile number</label>
              <input
                id="phone"
                value={form.phone}
                onChange={(e) => updateField('phone', e.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="school">School</label>
              <input
                id="school"
                value={form.school}
                onChange={(e) => updateField('school', e.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="parentPhone">Parent's mobile number</label>
              <input
                id="parentPhone"
                value={form.parentPhone}
                onChange={(e) => updateField('parentPhone', e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-accent btn-block" disabled={loading}>
              {loading ? 'Creating your account...' : 'Create account'}
            </button>
          </form>

          <p className="text-sm spacer-top">
            Already registered? <Link to="/student/login">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
