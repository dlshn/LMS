import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import * as endpoints from '../../api/endpoints';
import { useConfirm } from '../../context/ConfirmDialogContext';
import { IconTrash } from '../../components/icons';

const DURATIONS = [
  { value: '1D', label: '1 day' },
  { value: '2D', label: '2 days' },
  { value: '3D', label: '3 days' },
  { value: '7D', label: '7 days' },
  { value: '14D', label: '14 days' },
  { value: '30D', label: '30 days' },
];

export default function Notices() {
  const confirm = useConfirm();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [message, setMessage] = useState('');
  const [duration, setDuration] = useState('7D');
  const [posting, setPosting] = useState(false);

  async function loadNotices() {
    setLoading(true);
    try {
      const { data } = await endpoints.getAllNotices();
      setNotices(data.notices);
    } catch (err) {
      setError(err.response?.data?.error || 'Could not load notices.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadNotices();
  }, []);

  async function handlePost(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setPosting(true);
    try {
      await endpoints.createNotice({ message, duration });
      setSuccess('Notice posted.');
      setMessage('');
      await loadNotices();
    } catch (err) {
      setError(err.response?.data?.error || 'Could not post the notice.');
    } finally {
      setPosting(false);
    }
  }

  async function handleDelete(notice) {
    const ok = await confirm({
      title: 'Take this notice down?',
      message: 'Students will stop seeing it right away.',
      confirmLabel: 'Take down',
      danger: true,
    });
    if (!ok) return;
    try {
      await endpoints.deleteNotice(notice.id);
      await loadNotices();
    } catch (err) {
      setError(err.response?.data?.error || 'Could not delete the notice.');
    }
  }

  return (
    <AdminLayout>
      <div className="page-header">
        <h1>Notices</h1>
      </div>
      <p className="muted text-sm spacer-top" style={{ marginTop: -12, marginBottom: 20 }}>
        Notices show up for your students until they expire — no need to remove them manually.
      </p>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="sheet-card" style={{ marginBottom: 20 }}>
        <h3>Post a notice</h3>
        <form onSubmit={handlePost}>
          <div className="field">
            <label>Message</label>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="e.g. Term 2 exam is on Monday, bring your calculator."
              required
            />
          </div>
          <div className="field" style={{ maxWidth: 220 }}>
            <label>Expires after</label>
            <select value={duration} onChange={(e) => setDuration(e.target.value)}>
              {DURATIONS.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn btn-accent" disabled={posting}>
            {posting ? 'Posting...' : 'Post notice'}
          </button>
        </form>
      </div>

      {loading ? (
        <p className="muted">Loading...</p>
      ) : notices.length === 0 ? (
        <div className="empty-state sheet-card">
          <p>No notices posted yet.</p>
        </div>
      ) : (
        <div className="sheet-card table-card">
          <table className="mark-table">
            <thead>
              <tr>
                <th>Message</th>
                <th>Posted</th>
                <th>Expires</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {notices.map((n) => {
                const expired = new Date(n.expiresAt) <= new Date();
                return (
                  <tr key={n.id}>
                    <td data-label="Message" style={{ maxWidth: 320, whiteSpace: 'pre-wrap' }}>{n.message}</td>
                    <td className="muted" data-label="Posted">{new Date(n.createdAt).toLocaleDateString()}</td>
                    <td className="muted" data-label="Expires">{new Date(n.expiresAt).toLocaleString()}</td>
                    <td data-label="Status">
                      <span className={`stamp ${expired ? 'stamp-draft' : 'stamp-present'}`}>
                        {expired ? 'Expired' : 'Active'}
                      </span>
                    </td>
                    <td>
                      <button className="btn-danger-text" onClick={() => handleDelete(n)}>
                        <IconTrash /> Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}
