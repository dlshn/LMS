import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import * as endpoints from '../../api/endpoints';
import { useAdminAuth } from '../../context/AdminAuthContext';

export default function Settings() {
  const { updateLocalProfile } = useAdminAuth();
  const [form, setForm] = useState({
    tuitionClassName: '',
    subject: '',
    classType: 'PHYSICAL',
    adminName: '',
    phone: '',
  });
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    endpoints
      .getSettings()
      .then(({ data }) => {
        setForm({
          tuitionClassName: data.tuitionClassName || '',
          subject: data.subject || '',
          classType: data.classType || 'PHYSICAL',
          adminName: data.adminName || '',
          phone: data.phone || '',
        });
        setEmail(data.email || '');
      })
      .catch((err) => setError(err.response?.data?.error || 'Could not load settings.'))
      .finally(() => setLoading(false));
  }, []);

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);
    try {
      const { data } = await endpoints.updateSettings(form);
      updateLocalProfile({ adminName: data.adminName, tuitionClassName: data.tuitionClassName });
      setSuccess('Settings saved.');
    } catch (err) {
      setError(err.response?.data?.error || 'Could not save settings.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminLayout>
      <div className="page-header">
        <h1>Settings</h1>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {loading ? (
        <p className="muted">Loading...</p>
      ) : (
        <div className="sheet-card" style={{ maxWidth: 520 }}>
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="tuitionClassName">Class name</label>
              <input
                id="tuitionClassName"
                value={form.tuitionClassName}
                onChange={(e) => updateField('tuitionClassName', e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="subject">Subject</label>
              <input
                id="subject"
                value={form.subject}
                onChange={(e) => updateField('subject', e.target.value)}
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
              <label htmlFor="adminName">Teacher name</label>
              <input
                id="adminName"
                value={form.adminName}
                onChange={(e) => updateField('adminName', e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="phone">Teacher mobile number</label>
              <input
                id="phone"
                type="tel"
                value={form.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input id="email" value={email} disabled />
              <p className="muted text-sm">Email can't be changed here — it's your login username.</p>
            </div>
            <button type="submit" className="btn btn-accent" disabled={saving}>
              {saving ? 'Saving...' : 'Save changes'}
            </button>
          </form>
        </div>
      )}
    </AdminLayout>
  );
}
