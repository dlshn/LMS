import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useConfirm } from '../../context/ConfirmDialogContext';
import * as endpoints from '../../api/endpoints';

const TABS = [
  { key: 'pending', label: 'Pending' },
  { key: 'active', label: 'Active' },
  { key: 'suspended', label: 'Suspended' },
];

export default function ClassManagement() {
  const { logout } = useAdminAuth();
  const navigate = useNavigate();
  const confirm = useConfirm();
  const [status, setStatus] = useState('pending');
  const [classes, setClasses] = useState([]);
  const [counts, setCounts] = useState({ pending: 0, active: 0, suspended: 0 });
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  function load(nextStatus = status) {
    setLoading(true);
    return endpoints
      .getSuperClasses(nextStatus)
      .then(({ data }) => {
        setClasses(data.classes);
        setCounts(data.counts);
      })
      .catch((err) => setError(err.response?.data?.error || 'Could not load classes.'))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load(status);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  // Runs a status change, then reloads the current tab so counts stay right.
  async function runAction(item, action, { title, message, confirmLabel, danger }) {
    const ok = await confirm({ title, message, confirmLabel, danger });
    if (!ok) return;

    setBusyId(item.id);
    setError('');
    setSuccess('');
    try {
      const { data } = await action(item.id);
      setSuccess(data.message);
      await load();
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setBusyId(null);
    }
  }

  const actions = {
    approve: (c) => runAction(c, endpoints.approveClass, {
      title: 'Approve this class?',
      message: `${c.name} will be activated and ${c.admin?.name || 'the teacher'} can log in.`,
      confirmLabel: 'Approve',
    }),
    reject: (c) => runAction(c, endpoints.rejectClass, {
      title: 'Reject this registration?',
      message: `${c.name} and the teacher's account will be deleted.`,
      confirmLabel: 'Reject',
      danger: true,
    }),
    suspend: (c) => runAction(c, endpoints.suspendClass, {
      title: 'Suspend this class?',
      message: `${c.admin?.name || 'The teacher'} and the students of ${c.name} will not be able to log in until it is reactivated.`,
      confirmLabel: 'Suspend',
      danger: true,
    }),
    reactivate: (c) => runAction(c, endpoints.reactivateClass, {
      title: 'Reactivate this class?',
      message: `${c.name} will be active again and its teacher and students can log in.`,
      confirmLabel: 'Reactivate',
    }),
  };

  async function handleLogout() {
    const ok = await confirm({
      title: 'Log out?',
      message: "You'll need to log in again to manage classes.",
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
          <button className="topbar-logout-btn" onClick={handleLogout}>Log out</button>
        </nav>
      </div>

      <div className="page-body">
        <div className="page-header">
          <h1>Classes</h1>
          <p className="muted text-sm">Approve new registrations, suspend or reactivate classes, or delete them permanently.</p>
        </div>

        <div className="status-tabs" role="tablist">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={status === tab.key}
              className={`status-tab ${status === tab.key ? 'active' : ''}`}
              onClick={() => setStatus(tab.key)}
            >
              {tab.label} <span className="status-tab-count">{counts[tab.key]}</span>
            </button>
          ))}
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        {loading ? (
          <p className="muted">Loading...</p>
        ) : classes.length === 0 ? (
          <div className="sheet-card">
            <p className="muted">No classes here.</p>
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
                    <th>Students</th>
                    <th>Created</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {classes.map((c) => (
                    <tr key={c.id}>
                      <td data-label="Class">
                        <span>{c.name}</span>
                        <div className="muted text-sm">
                          {c.subject} · {c.classType === 'ONLINE' ? 'Online' : 'Physical'}
                        </div>
                      </td>
                      <td data-label="Teacher">{c.admin?.name || '—'}</td>
                      <td data-label="Contact">
                        <div>{c.admin?.phone || '—'}</div>
                        <div className="muted text-sm">{c.admin?.email || ''}</div>
                      </td>
                      <td data-label="Students">{c.studentCount}</td>
                      <td data-label="Created" className="muted">{new Date(c.createdAt).toLocaleDateString()}</td>
                      <td data-label="Action">
                        <div className="row-actions">
                          {c.status === 'pending' && (
                            <>
                              <button type="button" className="btn btn-accent btn-sm" disabled={busyId === c.id} onClick={() => actions.approve(c)}>
                                Approve
                              </button>
                              <button type="button" className="btn btn-danger-solid btn-sm" disabled={busyId === c.id} onClick={() => actions.reject(c)}>
                                Reject
                              </button>
                            </>
                          )}
                          {c.status === 'active' && (
                            <button type="button" className="btn btn-ghost btn-sm" disabled={busyId === c.id} onClick={() => actions.suspend(c)}>
                              Suspend
                            </button>
                          )}
                          {c.status === 'suspended' && (
                            <button type="button" className="btn btn-accent btn-sm" disabled={busyId === c.id} onClick={() => actions.reactivate(c)}>
                              Reactivate
                            </button>
                          )}
                          {c.status !== 'pending' && (
                            <button type="button" className="btn btn-danger-solid btn-sm" disabled={busyId === c.id} onClick={() => setDeleteTarget(c)}>
                              Delete
                            </button>
                          )}
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

      {deleteTarget && (
        <DeleteClassDialog
          tuitionClass={deleteTarget}
          onCancel={() => setDeleteTarget(null)}
          onDeleted={(message) => {
            setDeleteTarget(null);
            setSuccess(message);
            load();
          }}
          onError={(message) => setError(message)}
        />
      )}
    </div>
  );
}

// Permanent delete. The super admin must type the exact class name before the
// Delete button unlocks, so a click can't remove a class by accident.
function DeleteClassDialog({ tuitionClass, onCancel, onDeleted, onError }) {
  const [typed, setTyped] = useState('');
  const [deleting, setDeleting] = useState(false);
  const matches = typed.trim() === tuitionClass.name;

  async function handleDelete() {
    setDeleting(true);
    try {
      const { data } = await endpoints.deleteClass(tuitionClass.id, typed.trim());
      onDeleted(data.message);
    } catch (err) {
      onError(err.response?.data?.error || 'Could not delete the class.');
      setDeleting(false);
    }
  }

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="delete-class-title">
      <div className="modal-card">
        <h2 id="delete-class-title">Delete {tuitionClass.name}?</h2>
        <p className="text-sm">
          This permanently deletes the class, its {tuitionClass.studentCount} students, attendance, exams and marks,
          notices, recordings, notes and the poster. Files stored in R2 are deleted too. This cannot be undone.
        </p>
        <div className="field">
          <label htmlFor="confirm-class-name">
            Type <strong>{tuitionClass.name}</strong> to confirm
          </label>
          <input
            id="confirm-class-name"
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            autoComplete="off"
          />
        </div>
        <div className="modal-actions">
          <button type="button" className="btn btn-ghost" onClick={onCancel} disabled={deleting}>
            Cancel
          </button>
          <button type="button" className="btn btn-danger-solid" onClick={handleDelete} disabled={!matches || deleting}>
            {deleting ? 'Deleting...' : 'Delete permanently'}
          </button>
        </div>
      </div>
    </div>
  );
}
