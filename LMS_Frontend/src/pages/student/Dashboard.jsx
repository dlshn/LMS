import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStudentAuth } from '../../context/StudentAuthContext';
import * as endpoints from '../../api/endpoints';

export default function StudentDashboard() {
  const { student, logout } = useStudentAuth();
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    endpoints
      .getMyResults()
      .then(({ data }) => setResults(data.results))
      .catch((err) => setError(err.response?.data?.error || 'Could not load your results.'))
      .finally(() => setLoading(false));
  }, []);

  function handleLogout() {
    logout();
    navigate('/student/login');
  }

  return (
    <div className="app-shell">
      <div className="topbar">
        <div className="topbar-brand">
          STLMS <span>Student</span>
        </div>
        <nav className="topbar-nav">
          <button onClick={handleLogout}>Log out</button>
        </nav>
      </div>
      <div className="page-body">
        <div className="page-header">
          <h1>Hi, {student?.fullName}</h1>
        </div>
        <p className="muted text-sm">
          Student number: <span className="student-number">{student?.studentNumber}</span>
        </p>

        {error && <div className="alert alert-error">{error}</div>}

        <div className="sheet-card spacer-top">
          <h3>Your results</h3>
          {loading ? (
            <p className="muted">Loading...</p>
          ) : results.length === 0 ? (
            <p className="muted">No published results yet. Check back once your admin releases one.</p>
          ) : (
            <table className="mark-table">
              <thead>
                <tr>
                  <th>Exam</th>
                  <th>Subject</th>
                  <th>Date</th>
                  <th>Marks</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r) => (
                  <tr key={r.exam.id}>
                    <td>{r.exam.title}</td>
                    <td className="muted">{r.exam.subject}</td>
                    <td className="muted">{new Date(r.exam.examDate).toLocaleDateString()}</td>
                    <td>
                      <span className="score-red">
                        {r.marksObtained} / {r.exam.maxMarks}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
