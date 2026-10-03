import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useConfirm } from '../../context/ConfirmDialogContext';
import * as endpoints from '../../api/endpoints';
import {
  IconUsers,
  IconCheckCircle,
  IconEdit,
  IconCopy,
  IconGraduationCap,
  IconClock,
  IconBookOpen,
  IconBell,
} from '../../components/icons';

export default function AdminDashboard() {
  const { admin } = useAdminAuth();
  const confirm = useConfirm();
  const [students, setStudents] = useState([]);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [posterUrl, setPosterUrl] = useState(null);
  const [posterUploading, setPosterUploading] = useState(false);
  const [posterError, setPosterError] = useState('');
  const [codeCopied, setCodeCopied] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [studentsRes, examsRes, posterRes] = await Promise.all([
          endpoints.getAllStudents(),
          endpoints.getAllExams(),
          endpoints.getPoster(),
        ]);
        setStudents(studentsRes.data.students);
        setExams(examsRes.data.exams);
        setPosterUrl(posterRes.data.posterImageUrl);
      } catch (err) {
        setError(err.response?.data?.error || 'Could not load dashboard data.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handlePosterUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    setPosterError('');
    setPosterUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const { data } = await endpoints.uploadPoster(formData);
      setPosterUrl(data.posterImageUrl);
    } catch (err) {
      setPosterError(err.response?.data?.error || 'Could not upload the poster.');
    } finally {
      setPosterUploading(false);
      e.target.value = '';
    }
  }

  async function handlePosterDelete() {
    const ok = await confirm({
      title: 'Remove class poster?',
      message: 'Students will no longer see it on their dashboard.',
      confirmLabel: 'Remove',
      danger: true,
    });
    if (!ok) return;
    setPosterError('');
    try {
      await endpoints.deletePoster();
      setPosterUrl(null);
    } catch (err) {
      setPosterError(err.response?.data?.error || 'Could not remove the poster.');
    }
  }

  const publishedCount = exams.filter((e) => e.status === 'PUBLISHED').length;
  const draftCount = exams.filter((e) => e.status === 'DRAFT').length;

  async function handleCopyCode() {
    if (!admin?.joinCode) return;
    try {
      await navigator.clipboard.writeText(admin.joinCode);
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 1500);
    } catch {
      // Clipboard API can be unavailable (e.g. no HTTPS) — the code is
      // already selectable/visible, so there's nothing more to do.
    }
  }

  return (
    <AdminLayout>
      <div className="page-header">
        <h1>Welcome back{admin?.adminName ? `, ${admin.adminName}` : ''}</h1>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <p className="muted">Loading...</p>
      ) : (
        <>
          <div className="stat-grid">
            <div className="stat-card stat-card--icon">
              <span className="stat-icon-badge stat-icon-badge--ink">
                <IconUsers />
              </span>
              <div>
                <div className="stat-label">Total students</div>
                <div className="stat-value">{students.length}</div>
              </div>
            </div>
            <div className="stat-card stat-card--icon">
              <span className="stat-icon-badge stat-icon-badge--green">
                <IconCheckCircle />
              </span>
              <div>
                <div className="stat-label">Exams (published)</div>
                <div className="stat-value">{publishedCount}</div>
              </div>
            </div>
            <div className="stat-card stat-card--icon">
              <span className="stat-icon-badge stat-icon-badge--gold">
                <IconEdit />
              </span>
              <div>
                <div className="stat-label">Exams (draft)</div>
                <div className="stat-value">{draftCount}</div>
              </div>
            </div>
          </div>

          <div className="dashboard-grid" style={{ alignItems: 'stretch' }}>
            <div className="sheet-card" style={{ display: 'flex', flexDirection: 'column' }}>
              <h3>Your class join code</h3>
              <p className="muted text-sm">
                Share this code with your students. They'll use it, together with the student number you
                give them, to create their own login.
              </p>
              <div className="join-code-box">
                <span className="join-code-box-value">{admin?.joinCode || '—'}</span>
                <button type="button" className="join-code-copy-btn" onClick={handleCopyCode}>
                  <IconCopy />
                  {codeCopied ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>

            <div className="sheet-card" style={{ display: 'flex', flexDirection: 'column' }}>
              <h3>Class poster</h3>
              <p className="muted text-sm">Shown at the top of your students' dashboard.</p>

              {posterError && <div className="alert alert-error">{posterError}</div>}

              <div className="admin-poster-row">
                {posterUrl && (
                  <div className="poster-hero-image" style={{ width: 56, flexShrink: 0 }}>
                    <img src={posterUrl} alt="Class poster" />
                  </div>
                )}
                <div className="flex-row" style={{ flexWrap: 'wrap' }}>
                  <label className="btn btn-ghost btn-sm" style={{ cursor: 'pointer' }}>
                    {posterUploading ? 'Uploading...' : posterUrl ? 'Replace poster' : 'Upload poster'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePosterUpload}
                      disabled={posterUploading}
                      style={{ display: 'none' }}
                    />
                  </label>
                  {posterUrl && (
                    <button className="btn-danger-text" onClick={handlePosterDelete}>
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="sheet-card">
            <h3>Quick actions</h3>
            <div className="quick-actions-grid">
              <Link to="/admin/students" className="quick-action-tile">
                <IconUsers />
                Manage students
              </Link>
              <Link to="/admin/exams" className="quick-action-tile">
                <IconGraduationCap />
                Manage exams
              </Link>
              <Link to="/admin/attendance" className="quick-action-tile">
                <IconClock />
                Mark attendance
              </Link>
              <Link to="/admin/notes" className="quick-action-tile">
                <IconBookOpen />
                Upload notes
              </Link>
              <Link to="/admin/notices" className="quick-action-tile">
                <IconBell />
                Post a notice
              </Link>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
}
