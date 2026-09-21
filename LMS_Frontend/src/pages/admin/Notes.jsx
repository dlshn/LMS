import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import * as endpoints from '../../api/endpoints';

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  async function loadNotes() {
    setLoading(true);
    try {
      const { data } = await endpoints.getAllNotes();
      setNotes(data.notes);
    } catch (err) {
      setError(err.response?.data?.error || 'Could not load notes.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadNotes();
  }, []);

  async function handleUpload(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!file) {
      setError('Choose a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('file', file);

    setUploading(true);
    try {
      await endpoints.uploadNote(formData);
      setSuccess('Note uploaded.');
      setTitle('');
      setFile(null);
      e.target.reset();
      await loadNotes();
    } catch (err) {
      setError(err.response?.data?.error || 'Could not upload the note.');
    } finally {
      setUploading(false);
    }
  }

  return (
    <AdminLayout>
      <div className="page-header">
        <h1>Notes</h1>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="sheet-card" style={{ marginBottom: 20 }}>
        <h3>Upload a note</h3>
        <form onSubmit={handleUpload}>
          <div className="field">
            <label>Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div className="field">
            <label>File (PDF, image, Word, slides)</label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              accept=".pdf,.doc,.docx,.ppt,.pptx,.png,.jpg,.jpeg"
              required
            />
          </div>
          <button type="submit" className="btn btn-accent" disabled={uploading}>
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </form>
      </div>

      {loading ? (
        <p className="muted">Loading...</p>
      ) : notes.length === 0 ? (
        <div className="empty-state sheet-card">
          <p>No notes uploaded yet.</p>
        </div>
      ) : (
        <div className="sheet-card" style={{ padding: 0 }}>
          <table className="mark-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Type</th>
                <th>Uploaded</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {notes.map((n) => (
                <tr key={n.id}>
                  <td>{n.title}</td>
                  <td className="muted student-number">{n.fileType}</td>
                  <td className="muted">{new Date(n.uploadedAt).toLocaleDateString()}</td>
                  <td>
                    <a href={n.fileUrl} target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm">
                      Download
                    </a>
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
