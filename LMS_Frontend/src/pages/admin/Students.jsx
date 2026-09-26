import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import * as endpoints from '../../api/endpoints';
import { useConfirm } from '../../context/ConfirmDialogContext';

const emptyForm = {
  studentNumber: '',
  fullName: '',
  school: '',
  phone: '',
  parentPhone: '',
};

export default function Students() {
  const confirm = useConfirm();
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
        await endpoints.registerStudent({
          studentNumber: form.studentNumber,
          fullName: form.fullName,
        });
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
    const ok = await confirm({
      title: `Delete ${student.fullName}?`,
      message: 'Their attendance and marks will be deleted too. This cannot be undone.',
      confirmLabel: 'Delete',
      danger: true,
    });
    if (!ok) return;
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
          <h3>{editingId ? 'Edit student' : 'Add a new student'}</h3>
          {!editingId && (
            <p className="muted text-sm">
              This just adds them to your roster. They'll finish creating their own login using their
              student number and your class join code — see your dashboard for the code.
            </p>
          )}
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label>Full name</label>
              <input
                value={form.fullName}
                onChange={(e) => updateField('fullName', e.target.value)}
                required
              />
            </div>

            {!editingId ? (
              <div className="field">
                <label>Student number</label>
                <input
                  value={form.studentNumber}
                  onChange={(e) => updateField('studentNumber', e.target.value)}
                  placeholder="S001"
                  required
                />
              </div>
            ) : (
              <>
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
              </>
            )}

            <div className="flex-row">
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Saving...' : editingId ? 'Save changes' : 'Add student'}
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
        <div className="sheet-card table-card">
          <table className="mark-table">
            <thead>
              <tr>
                <th>Student No.</th>
                <th>Name</th>
                <th>School</th>
                <th>Phone</th>
                <th>Login</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.id}>
                  <td className="student-number" data-label="Student No.">{s.studentNumber}</td>
                  <td data-label="Name">{s.fullName}</td>
                  <td className="muted" data-label="School">{s.school || '—'}</td>
                  <td className="muted" data-label="Phone">{s.phone || '—'}</td>
                  <td data-label="Login">
                    {s.isActivated ? (
                      <span className="stamp stamp-present">Registered</span>
                    ) : (
                      <span className="stamp stamp-draft">Pending</span>
                    )}
                  </td>
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
