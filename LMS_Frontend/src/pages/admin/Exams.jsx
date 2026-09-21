import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import * as endpoints from '../../api/endpoints';

const emptyForm = {
  title: '',
  subject: '',
  examDate: '',
  description: '',
  maxMarks: 100,
};

export default function Exams() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [publishingId, setPublishingId] = useState(null);

  async function loadExams() {
    setLoading(true);
    try {
      const { data } = await endpoints.getAllExams();
      setExams(data.exams);
    } catch (err) {
      setError(err.response?.data?.error || 'Could not load exams.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadExams();
  }, []);

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function startAdd() {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  }

  function startEdit(exam) {
    setForm({
      title: exam.title,
      subject: exam.subject,
      examDate: exam.examDate.slice(0, 10),
      description: exam.description || '',
      maxMarks: exam.maxMarks,
    });
    setEditingId(exam.id);
    setShowForm(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      if (editingId) {
        await endpoints.updateExam(editingId, form);
      } else {
        await endpoints.createExam(form);
      }
      setShowForm(false);
      await loadExams();
    } catch (err) {
      setError(err.response?.data?.error || 'Could not save exam.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handlePublish(exam) {
    if (!confirm(`Publish "${exam.title}"? Students will be able to see marks entered so far.`)) {
      return;
    }
    setPublishingId(exam.id);
    setError('');
    try {
      await endpoints.publishExam(exam.id);
      await loadExams();
    } catch (err) {
      setError(err.response?.data?.error || 'Could not publish exam.');
    } finally {
      setPublishingId(null);
    }
  }

  return (
    <AdminLayout>
      <div className="page-header">
        <h1>Exams</h1>
        <button className="btn btn-accent" onClick={startAdd}>
          + Create exam
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {showForm && (
        <div className="sheet-card" style={{ marginBottom: 20 }}>
          <h3>{editingId ? 'Edit exam' : 'Create a new exam'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label>Title</label>
              <input value={form.title} onChange={(e) => updateField('title', e.target.value)} required />
            </div>
            <div className="field">
              <label>Subject</label>
              <input value={form.subject} onChange={(e) => updateField('subject', e.target.value)} required />
            </div>
            <div className="field">
              <label>Exam date</label>
              <input
                type="date"
                value={form.examDate}
                onChange={(e) => updateField('examDate', e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label>Max marks</label>
              <input
                type="number"
                value={form.maxMarks}
                onChange={(e) => updateField('maxMarks', e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label>Description (optional)</label>
              <textarea
                rows={2}
                value={form.description}
                onChange={(e) => updateField('description', e.target.value)}
              />
            </div>
            <div className="flex-row">
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Saving...' : editingId ? 'Save changes' : 'Create exam'}
              </button>
              <button type="button" className="btn btn-ghost" onClick={() => setShowForm(false)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <p className="muted">Loading...</p>
      ) : exams.length === 0 ? (
        <div className="empty-state sheet-card">
          <p>No exams yet. Create your first one.</p>
        </div>
      ) : (
        <div className="sheet-card" style={{ padding: 0 }}>
          <table className="mark-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Subject</th>
                <th>Date</th>
                <th>Max marks</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {exams.map((exam) => (
                <tr key={exam.id}>
                  <td>{exam.title}</td>
                  <td className="muted">{exam.subject}</td>
                  <td className="muted">{new Date(exam.examDate).toLocaleDateString()}</td>
                  <td className="student-number">{exam.maxMarks}</td>
                  <td>
                    <span className={`stamp ${exam.status === 'PUBLISHED' ? 'stamp-published' : 'stamp-draft'}`}>
                      {exam.status}
                    </span>
                  </td>
                  <td>
                    <div className="flex-row">
                      <Link to={`/admin/exams/${exam.id}/marks`} className="btn btn-ghost btn-sm">
                        Marks
                      </Link>
                      {exam.status === 'DRAFT' && (
                        <>
                          <button className="btn btn-ghost btn-sm" onClick={() => startEdit(exam)}>
                            Edit
                          </button>
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => handlePublish(exam)}
                            disabled={publishingId === exam.id}
                          >
                            {publishingId === exam.id ? 'Publishing...' : 'Publish'}
                          </button>
                        </>
                      )}
                    </div>
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
