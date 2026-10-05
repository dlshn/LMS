import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useConfirm } from '../../context/ConfirmDialogContext';
import * as endpoints from '../../api/endpoints';

export default function PendingClasses() {
  const { logout } = useAdminAuth();
  const navigate = useNavigate();
  const confirm = useConfirm();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    endpoints
      .getPendingClasses()
      .then(({ data }) => setClasses(data.classes))
      .catch((err) => setError(err.response?.data?.error || 'Could not load pending classes.'))
      .finally(() => setLoading(false));
  }, []);

  async function handleDecision(item, approve) {
    const ok = await confirm({
      title: approve ? 'Approve this class?' : 'Reject this registration?',
      message: approve
        ? `${item.name} will be activated and ${item.admin?.name || 'the teacher'} can log in.`
        : `${item.name} and the teacher's account will be deleted. This cannot be undone.`,
      confirmLabel: approve ? 'Approve' : 'Reject',
      danger: !approve,
    });
    if (!ok) return;

    setBusyId(item.id);
    setError('');
    setSuccess('');
    try {
      if (approve) {
        await endpoints.approveClass(item.id);
        setSuccess(`${item.name} approved.`);
      } else {
        await endpoints.rejectClass(item.id);
        setSuccess(`${item.name} rejected.`);
      }
      setClasses((prev) => prev.filter((c) => c.id !== item.id));
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setBusyId(null);
    }
  }

  async function handleLogout() {
    const ok = await confirm({
      title: 'Log out?',
      message: "You'll need to log in again to see pending registrations.",
      confirmLabel: 'Log out',
      danger: true,
    });
    if (!ok) return;
    logout();
    navigate('/admin/login');
  }

  return (
    <div className="app-shell">
      <div className="topbar">
        <div className="topbar-head">
          <div className="topbar-brand">
            Platform <span>admin</span>
          </div>
        </div>
        <nav className="topbar-nav open">
          <NavLink to="/admin/dashboard">My class</NavLink>
          <button className="topbar-logout-btn" onClick={handleLogout}>Log out</button>
        </nav>
      </div>

      <div className="page-body">
        <div className="page-header">
          <h1>Pending class registrations</h1>
          <p className="muted text-sm">Teachers can log in only after their class is approved here.</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        {loading ? (
          <p className="muted">Loading...</p>
        ) : classes.length === 0 ? (
          <div className="sheet-card">
            <p className="muted">No classes are waiting for approval.</p>
          </div>
        ) : (
          <div className="sheet-card">
            <div className="table-card">
              <table className="mark-table">
                <thead>
                  <tr>
                    <th>Class</th>
                    <th>Teacher</th>
                    <th>Contact</th>
                    <th>Type</th>
                    <th>Requested</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {classes.map((c) => (
                    <tr key={c.id}>
                      <td data-label="Class">
                        <span>{c.name}</span>
                        <div className="muted text-sm">{c.subject}</div>
                      </td>
                      <td data-label="Teacher">{c.admin?.name || '—'}</td>
                      <td data-label="Contact">
                        <div>{c.admin?.phone || '—'}</div>
                        <div className="muted text-sm">{c.admin?.email || ''}</div>
                      </td>
                      <td data-label="Type">{c.classType === 'ONLINE' ? 'Online' : 'Physical'}</td>
                      <td data-label="Requested" className="muted">{new Date(c.createdAt).toLocaleDateString()}</td>
                      <td data-label="Action">
                        <div className="row-actions">
                          <button
                            type="button"
                            className="btn btn-accent btn-sm"
                            disabled={busyId === c.id}
                            onClick={() => handleDecision(c, true)}
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            className="btn btn-danger-solid btn-sm"
                            disabled={busyId === c.id}
                            onClick={() => handleDecision(c, false)}
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
