import { useEffect, useRef, useState } from 'react';
import * as endpoints from '../api/endpoints';
import { IconBell } from './icons';

// A bell button in the topbar that shows the student's tuition class's
// still-active notices (server already filtered out expired ones — see
// notice.controller#getActiveNoticesForStudent). Click toggles a dropdown;
// clicking outside it closes it.
export default function NoticeBell() {
  const [notices, setNotices] = useState([]);
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    endpoints
      .getActiveNotices()
      .then(({ data }) => setNotices(data.notices))
      .catch(() => {});
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="notice-bell" ref={wrapRef}>
      <button
        type="button"
        className="notice-bell-btn"
        onClick={() => setOpen((o) => !o)}
        aria-label={`Notices${notices.length ? ` (${notices.length} active)` : ''}`}
        aria-expanded={open}
      >
        <IconBell />
        {notices.length > 0 && <span className="notice-bell-badge">{notices.length}</span>}
      </button>

      {open && (
        <div className="notice-bell-panel">
          <div className="notice-bell-header">Notices</div>
          {notices.length === 0 ? (
            <p className="muted text-sm notice-bell-empty">No active notices right now.</p>
          ) : (
            <ul className="notice-bell-list">
              {notices.map((n) => (
                <li key={n.id}>
                  <p>{n.message}</p>
                  <span className="muted text-sm">{new Date(n.createdAt).toLocaleDateString()}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
