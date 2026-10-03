import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import * as endpoints from '../../api/endpoints';

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export default function Attendance() {
  const [date, setDate] = useState(todayISO());
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  // History section — view one student's past records separately from
  // the bulk marking form above.
  const [historyStudentId, setHistoryStudentId] = useState('');
  const [records, setRecords] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loadingHistory, setLoadingHistory] = useState(false);

  async function loadForDate(d) {
    setLoading(true);
    setError('');
    try {
      const { data } = await endpoints.getAttendanceForDate(d);
      setRows(data.students);
      if (!historyStudentId && data.students.length > 0) {
        setHistoryStudentId(data.students[0].studentId);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Could not load the attendance form.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadForDate(date);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  async function loadHistory(studentId) {
    if (!studentId) return;
    setLoadingHistory(true);
    try {
      const { data } = await endpoints.getStudentAttendance(studentId);
      setRecords(data.records);
      setSummary(data.summary);
    } catch (err) {
      setError(err.response?.data?.error || 'Could not load attendance history.');
    } finally {
      setLoadingHistory(false);
    }
  }

  useEffect(() => {
    if (historyStudentId) loadHistory(historyStudentId);
  }, [historyStudentId]);

  function setStatus(studentId, status) {
    setRows((prev) => prev.map((r) => (r.studentId === studentId ? { ...r, status } : r)));
  }

  function markAllPresent() {
    setRows((prev) => prev.map((r) => ({ ...r, status: 'PRESENT' })));
  }

  async function handleSave() {
    setError('');
    setSuccess('');
    const toSave = rows.filter((r) => r.status).map((r) => ({ studentId: r.studentId, status: r.status }));
    if (toSave.length === 0) {
      setError('Mark at least one student before saving.');
      return;
    }
    setSaving(true);
    try {
      const { data } = await endpoints.markBulkAttendance(date, toSave);
      setSuccess(data.message);
      if (historyStudentId) await loadHistory(historyStudentId);
    } catch (err) {
      setError(err.response?.data?.error || 'Could not save attendance.');
    } finally {
      setSaving(false);
    }
  }

  const markedCount = rows.filter((r) => r.status).length;

  return (
    <AdminLayout>
      <div className="page-header">
        <h1>Attendance</h1>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="sheet-card" style={{ marginBottom: 20 }}>
        <div className="page-header" style={{ marginBottom: 12 }}>
          <div>
            <h3>Mark attendance</h3>
            <p className="muted text-sm">{markedCount} of {rows.length} marked</p>
          </div>
          <div className="flex-row">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={{ width: 'auto' }}
            />
            <button type="button" className="btn btn-ghost btn-sm" onClick={markAllPresent} disabled={loading || rows.length === 0}>
              Mark all present
            </button>
            <button type="button" className="btn btn-accent" onClick={handleSave} disabled={saving || loading}>
              {saving ? 'Saving...' : 'Save attendance'}
            </button>
          </div>
        </div>

        {loading ? (
          <p className="muted">Loading...</p>
        ) : rows.length === 0 ? (
          <div className="empty-state">
            <p>No students in this tuition class yet. Add students before marking attendance.</p>
          </div>
        ) : (
          <div className="table-card">
            <table className="mark-table">
              <thead>
                <tr>
                  <th>Student No.</th>
                  <th>Name</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.studentId}>
                    <td className="student-number" data-label="Student No.">{row.studentNumber}</td>
                    <td data-label="Name">{row.fullName}</td>
                    <td data-label="Status">
                      <div className="attendance-toggle">
                        <button
                          type="button"
                          className={`attendance-toggle-btn attendance-toggle-btn--present ${row.status === 'PRESENT' ? 'active' : ''}`}
                          onClick={() => setStatus(row.studentId, 'PRESENT')}
                        >
                          Present
                        </button>
                        <button
                          type="button"
                          className={`attendance-toggle-btn attendance-toggle-btn--absent ${row.status === 'ABSENT' ? 'active' : ''}`}
                          onClick={() => setStatus(row.studentId, 'ABSENT')}
                        >
                          Absent
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="sheet-card">
        <h3>Attendance history</h3>
        <div className="field" style={{ maxWidth: 360 }}>
          <label>Student</label>
          <select value={historyStudentId} onChange={(e) => setHistoryStudentId(e.target.value)}>
            {rows.map((r) => (
              <option key={r.studentId} value={r.studentId}>
                {r.fullName} ({r.studentNumber})
              </option>
            ))}
          </select>
        </div>

        {loadingHistory ? (
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
