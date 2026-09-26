import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import * as endpoints from '../../api/endpoints';
import { useConfirm } from '../../context/ConfirmDialogContext';
import { getYoutubeThumbnail } from '../../utils/youtube';
import { IconTrash } from '../../components/icons';

export default function Recordings() {
  const confirm = useConfirm();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [title, setTitle] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function loadVideos() {
    setLoading(true);
    try {
      const { data } = await endpoints.getAllVideos();
      setVideos(data.videos);
    } catch (err) {
      setError(err.response?.data?.error || 'Could not load recordings.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadVideos();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await endpoints.createVideo({ title, youtubeUrl });
      setTitle('');
      setYoutubeUrl('');
      await loadVideos();
    } catch (err) {
      setError(err.response?.data?.error || 'Could not add the recording.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(video) {
    const ok = await confirm({
      title: `Delete "${video.title}"?`,
      message: 'Students will no longer be able to see this recording.',
      confirmLabel: 'Delete',
      danger: true,
    });
    if (!ok) return;
    try {
      await endpoints.deleteVideo(video.id);
      await loadVideos();
    } catch (err) {
      setError(err.response?.data?.error || 'Could not delete the recording.');
    }
  }

  return (
    <AdminLayout>
      <div className="page-header">
        <h1>Recordings</h1>
      </div>

      <p className="muted text-sm">
        Paste an Unlisted YouTube link (not Private — Private requires inviting each student's Google
        account, which isn't practical). Anyone with the link can watch it, so only share it here.
      </p>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="sheet-card" style={{ marginBottom: 20 }}>
        <h3>Add a recording</h3>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div className="field">
            <label>YouTube link</label>
            <input
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              placeholder="https://youtu.be/..."
              required
            />
          </div>
          <button type="submit" className="btn btn-accent" disabled={submitting}>
            {submitting ? 'Adding...' : 'Add recording'}
          </button>
        </form>
      </div>

      {loading ? (
        <p className="muted">Loading...</p>
      ) : videos.length === 0 ? (
        <div className="empty-state sheet-card">
          <p>No recordings yet. Add your first one above.</p>
        </div>
      ) : (
        <div className="video-grid">
          {videos.map((v) => (
            <div key={v.id} className="video-card sheet-card">
              <a href={v.youtubeUrl} target="_blank" rel="noreferrer" className="video-thumb">
                <img src={getYoutubeThumbnail(v.youtubeUrl)} alt={v.title} loading="lazy" />
              </a>
              <div className="video-card-body">
                <div>
                  <p className="video-card-title">{v.title}</p>
                  <p className="muted text-sm">{new Date(v.createdAt).toLocaleDateString()}</p>
                </div>
                <button
                  className="btn-danger-text"
                  onClick={() => handleDelete(v)}
                  aria-label="Delete recording"
                >
                  <IconTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
