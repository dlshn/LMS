import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import { useAdminAuth } from '../../context/AdminAuthContext';
import * as endpoints from '../../api/endpoints';

export default function AdminDashboard() {
  const { admin } = useAdminAuth();
  const [students, setStudents] = useState([]);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const [studentsRes, examsRes] = await Promise.all([
          endpoints.getAllStudents(),
          endpoints.getAllExams(),
        ]);
        setStudents(studentsRes.data.students);
        setExams(examsRes.data.exams);
      } catch (err) {
        setError(err.response?.data?.error || 'Could not load dashboard data.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

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
            <h3>Your Tuition Class ID</h3>
            <p className="muted text-sm">
              Share this with students so they can check results without logging in.
            </p>
            <p className="student-number" style={{ fontSize: '0.95rem', wordBreak: 'break-all' }}>
              {admin?.tuitionClassId}
            </p>
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
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
}
