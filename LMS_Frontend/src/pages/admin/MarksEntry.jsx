import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import * as endpoints from '../../api/endpoints';

export default function MarksEntry() {
  const { examId } = useParams();
  const [exam, setExam] = useState(null);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  async function loadForm() {
    setLoading(true);
    setError('');
    try {
      const { data } = await endpoints.getMarksEntryForm(examId);
      setExam(data.exam);
      setRows(data.students);
    } catch (err) {
      setError(err.response?.data?.error || 'Could not load the marks form.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadForm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [examId]);

  function updateMark(studentId, value) {
    setRows((prev) =>
      prev.map((r) => (r.studentId === studentId ? { ...r, marksObtained: value } : r))
    );
  }

  async function handleSave() {
    setError('');
    setSuccess('');
    setSaving(true);
    try {
      const marks = rows
        .filter((r) => r.marksObtained !== null && r.marksObtained !== '')
        .map((r) => ({ studentId: r.studentId, marksObtained: Number(r.marksObtained) }));

      if (marks.length === 0) {
        setError('Enter at least one mark before saving.');
        setSaving(false);
        return;
      }

      await endpoints.submitBulkMarks(examId, marks);
      setSuccess(`${marks.length} mark(s) saved.`);
      await loadForm();
    } catch (err) {
      setError(err.response?.data?.error || 'Could not save marks.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminLayout>
      <div className="page-header">
        <div>
          <Link to="/admin/exams" className="text-sm">&larr; Back to exams</Link>
          <h1>{exam ? exam.title : 'Marks entry'}</h1>
          {exam && (
            <p className="muted text-sm">
              Max marks: {exam.maxMarks} &middot;{' '}
              <span className={`stamp ${exam.status === 'PUBLISHED' ? 'stamp-published' : 'stamp-draft'}`}>
                {exam.status}
              </span>
            </p>
          )}
        </div>
        {exam?.status === 'DRAFT' && (
          <button className="btn btn-accent" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save all marks'}
          </button>
        )}
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {exam?.status === 'PUBLISHED' && (
        <div className="alert alert-success">
          This exam is published. Marks can no longer be changed here.
        </div>
      )}

      {loading ? (
        <p className="muted">Loading...</p>
      ) : rows.length === 0 ? (
        <div className="empty-state sheet-card">
          <p>No students in this tuition class yet. Add students before entering marks.</p>
        </div>
      ) : (
        <div className="sheet-card table-card">
          <table className="mark-table">
            <thead>
              <tr>
                <th>Student No.</th>
                <th>Name</th>
                <th>Marks (out of {exam?.maxMarks})</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.studentId}>
                  <td className="student-number" data-label="Student No.">{row.studentNumber}</td>
                  <td data-label="Name">{row.fullName}</td>
                  <td data-label={`Marks / ${exam?.maxMarks}`}>
                    <input
                      type="number"
                      className="marks-input"
                      min={0}
                      max={exam?.maxMarks}
                      value={row.marksObtained ?? ''}
                      disabled={exam?.status === 'PUBLISHED'}
                      onChange={(e) => updateMark(row.studentId, e.target.value)}
                      placeholder="—"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}
