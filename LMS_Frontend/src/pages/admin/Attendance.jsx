import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import * as endpoints from '../../api/endpoints';

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export default function Attendance() {
  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [date, setDate] = useState(todayISO());
  const [status, setStatus] = useState('PRESENT');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [records, setRecords] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loadingRecords, setLoadingRecords] = useState(false);

  useEffect(() => {
    endpoints.getAllStudents().then(({ data }) => {
      setStudents(data.students);
      if (data.students.length > 0) setSelectedStudentId(data.students[0].id);
    });
  }, []);

  async function loadAttendance(studentId) {
    if (!studentId) return;
    setLoadingRecords(true);
    try {
      const { data } = await endpoints.getStudentAttendance(studentId);
      setRecords(data.records);
      setSummary(data.summary);
    } catch (err) {
      setError(err.response?.data?.error || 'Could not load attendance.');
    } finally {
      setLoadingRecords(false);
    }
  }

  useEffect(() => {
    if (selectedStudentId) loadAttendance(selectedStudentId);
  }, [selectedStudentId]);

  async function handleMark(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);
    try {
      await endpoints.markAttendance({ studentId: selectedStudentId, date, status });
      setSuccess('Attendance recorded.');
      await loadAttendance(selectedStudentId);
    } catch (err) {
      setError(err.response?.data?.error || 'Could not record attendance.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AdminLayout>
      <div className="page-header">
        <h1>Attendance</h1>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="sheet-card" style={{ marginBottom: 20 }}>
        <h3>Mark attendance</h3>
        <form onSubmit={handleMark}>
          <div className="field">
            <label>Student</label>
            <select value={selectedStudentId} onChange={(e) => setSelectedStudentId(e.target.value)}>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.fullName} ({s.studentNumber})
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          </div>
          <div className="field">
            <label>Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="PRESENT">Present</option>
              <option value="ABSENT">Absent</option>
            </select>
          </div>
          <button type="submit" className="btn btn-accent" disabled={submitting || !selectedStudentId}>
            {submitting ? 'Saving...' : 'Save attendance'}
          </button>
        </form>
      </div>

      <div className="sheet-card">
        <h3>Attendance history</h3>
        {loadingRecords ? (
          <p className="muted">Loading...</p>
        ) : !records ? (
          <p className="muted">Select a student to see their attendance.</p>
        ) : (
          <>
            <div className="stat-grid" style={{ marginBottom: 16 }}>
              <div className="stat-card">
                <div className="stat-label">Present days</div>
                <div className="stat-value">{summary.presentDays}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Total marked</div>
                <div className="stat-value">{summary.totalDays}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Attendance %</div>
                <div className="stat-value">{summary.percentage}%</div>
              </div>
            </div>

            {records.length === 0 ? (
              <p className="muted">No attendance marked yet for this student.</p>
            ) : (
              <div className="table-card">
                <table className="mark-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.map((r) => (
                      <tr key={r.id}>
                        <td data-label="Date">{new Date(r.date).toLocaleDateString()}</td>
                        <td data-label="Status">
                          <span className={`stamp ${r.status === 'PRESENT' ? 'stamp-present' : 'stamp-absent'}`}>
                            {r.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
}
