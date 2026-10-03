import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useConfirm } from '../../context/ConfirmDialogContext';
import * as endpoints from '../../api/endpoints';

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
            <div className="stat-card">
              <div className="stat-label">Total students</div>
              <div className="stat-value">{students.length}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Exams (published)</div>
              <div className="stat-value">{publishedCount}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Exams (draft)</div>
              <div className="stat-value">{draftCount}</div>
            </div>
          </div>

          <div className="sheet-card" style={{ marginBottom: 20 }}>
            <h3>Your class join code</h3>
            <p className="muted text-sm">
              Share this code with your students. They'll use it, together with the student number you
              give them, to create their own login.
            </p>
            <p className="score-red" style={{ fontSize: '1.6rem', letterSpacing: '0.08em' }}>
              {admin?.joinCode || '—'}
            </p>
          </div>

          <div className="sheet-card" style={{ marginBottom: 20 }}>
            <h3>Class poster</h3>
            <p className="muted text-sm">
              Shown at the top of your students' dashboard — a class photo, an ad for enrollment, a
              banner with your name and subject, whatever represents your class.
            </p>

            {posterError && <div className="alert alert-error">{posterError}</div>}

            {posterUrl && (
              <div className="poster-hero-image" style={{ width: 160, margin: '12px 0' }}>
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

          <div className="sheet-card">
            <h3>Quick actions</h3>
            <div className="flex-row" style={{ flexWrap: 'wrap' }}>
              <Link to="/admin/students" className="btn btn-primary">
                Manage students
              </Link>
              <Link to="/admin/exams" className="btn btn-ghost">
                Manage exams
              </Link>
              <Link to="/admin/attendance" className="btn btn-ghost">
                Mark attendance
              </Link>
              <Link to="/admin/notes" className="btn btn-ghost">
                Upload notes
              </Link>
              <Link to="/admin/notices" className="btn btn-ghost">
                Post a notice
              </Link>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
}
