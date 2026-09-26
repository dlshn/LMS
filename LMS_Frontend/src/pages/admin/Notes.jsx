import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import * as endpoints from '../../api/endpoints';
import { useConfirm } from '../../context/ConfirmDialogContext';
import { getFileDisplay, formatUploaded } from '../../utils/fileType';
import { IconFilePdf, IconImage, IconDownload, IconTrash } from '../../components/icons';

export default function Notes() {
  const confirm = useConfirm();
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

  async function handleDelete(note) {
    const ok = await confirm({
      title: `Delete "${note.title}"?`,
      message: 'Students will no longer be able to download this note.',
      confirmLabel: 'Delete',
      danger: true,
    });
    if (!ok) return;
    try {
      await endpoints.deleteNote(note.id);
      await loadNotes();
    } catch (err) {
      setError(err.response?.data?.error || 'Could not delete the note.');
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
        <div className="note-list">
          {notes.map((n) => {
            const display = getFileDisplay(n.fileType);
            return (
              <div key={n.id} className="note-row">
                <div className={`note-row-icon note-row-icon--${display.kind}`}>
                  {display.kind === 'image' ? <IconImage /> : <IconFilePdf />}
                </div>
                <div className="note-row-main">
                  <div className="note-row-title-line">
                    <span className="note-row-title">{n.title}</span>
                    <span className="note-row-badge">{display.label}</span>
                  </div>
                  <p className="note-row-meta">Uploaded {formatUploaded(n.uploadedAt)}</p>
                </div>
                <div className="note-row-actions">
                  <a href={n.fileUrl} target="_blank" rel="noreferrer" className="note-row-download" aria-label="Download">
                    <IconDownload />
                  </a>
                  <button className="note-row-download note-row-download--danger" onClick={() => handleDelete(n)} aria-label="Delete note">
                    <IconTrash />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AdminLayout>
  );
}
