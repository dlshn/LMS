import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import * as endpoints from '../../api/endpoints';

const emptyForm = {
  studentNumber: '',
  fullName: '',
  username: '',
  password: '',
  school: '',
  phone: '',
  parentPhone: '',
};

export default function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function loadStudents() {
    setLoading(true);
    try {
      const { data } = await endpoints.getAllStudents();
      setStudents(data.students);
    } catch (err) {
      setError(err.response?.data?.error || 'Could not load students.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStudents();
  }, []);

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function startAdd() {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  }

  function startEdit(student) {
    setForm({
      studentNumber: student.studentNumber,
      fullName: student.fullName,
      username: student.username,
      password: '',
      school: student.school || '',
      phone: student.phone || '',
      parentPhone: student.parentPhone || '',
    });
    setEditingId(student.id);
    setShowForm(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      if (editingId) {
        await endpoints.updateStudent(editingId, {
          fullName: form.fullName,
          school: form.school,
          phone: form.phone,
          parentPhone: form.parentPhone,
        });
      } else {
        await endpoints.registerStudent(form);
      }
      setShowForm(false);
      await loadStudents();
    } catch (err) {
      setError(err.response?.data?.error || 'Could not save student.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(student) {
    if (!confirm(`Delete ${student.fullName}? Their attendance and marks will be deleted too. This cannot be undone.`)) {
      return;
    }
    try {
      await endpoints.deleteStudent(student.id);
      await loadStudents();
    } catch (err) {
      setError(err.response?.data?.error || 'Could not delete student.');
    }
  }

  return (
    <AdminLayout>
      <div className="page-header">
        <h1>Students</h1>
        <button className="btn btn-accent" onClick={startAdd}>
          + Add student
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {showForm && (
        <div className="sheet-card spacer-top" style={{ marginBottom: 20 }}>
          <h3>{editingId ? 'Edit student' : 'Register a new student'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label>Full name</label>
              <input
                value={form.fullName}
                onChange={(e) => updateField('fullName', e.target.value)}
                required
              />
            </div>

            {!editingId && (
              <>
                <div className="field">
                  <label>Student number</label>
                  <input
                    value={form.studentNumber}
                    onChange={(e) => updateField('studentNumber', e.target.value)}
                    placeholder="S001"
                    required
                  />
                </div>
                <div className="field">
                  <label>Username (for student login)</label>
                  <input
                    value={form.username}
                    onChange={(e) => updateField('username', e.target.value)}
                    required
                  />
                </div>
                <div className="field">
                  <label>Password</label>
                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) => updateField('password', e.target.value)}
                    required
                  />
                </div>
              </>
            )}

            <div className="field">
              <label>School</label>
              <input value={form.school} onChange={(e) => updateField('school', e.target.value)} />
            </div>
            <div className="field">
              <label>Phone</label>
              <input value={form.phone} onChange={(e) => updateField('phone', e.target.value)} />
            </div>
            <div className="field">
              <label>Parent's phone</label>
              <input
                value={form.parentPhone}
                onChange={(e) => updateField('parentPhone', e.target.value)}
              />
            </div>

            <div className="flex-row">
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Saving...' : editingId ? 'Save changes' : 'Register student'}
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
      ) : students.length === 0 ? (
        <div className="empty-state sheet-card">
          <p>No students yet. Add your first one to get started.</p>
        </div>
      ) : (
        <div className="sheet-card" style={{ padding: 0 }}>
          <table className="mark-table">
            <thead>
              <tr>
                <th>Student No.</th>
                <th>Name</th>
                <th>School</th>
                <th>Phone</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.id}>
                  <td className="student-number">{s.studentNumber}</td>
                  <td>{s.fullName}</td>
                  <td className="muted">{s.school || '—'}</td>
                  <td className="muted">{s.phone || '—'}</td>
                  <td>
                    <div className="flex-row">
                      <button className="btn btn-ghost btn-sm" onClick={() => startEdit(s)}>
                        Edit
                      </button>
                      <button className="btn-danger-text" onClick={() => handleDelete(s)}>
                        Delete
                      </button>
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
