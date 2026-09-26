import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import { useConfirm } from '../context/ConfirmDialogContext';

export default function AdminLayout({ children }) {
  const { admin, logout } = useAdminAuth();
  const navigate = useNavigate();
  const confirm = useConfirm();
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleLogout() {
    setMenuOpen(false);
    const ok = await confirm({
      title: 'Log out?',
      message: "You'll need to log in again to access the admin dashboard.",
      confirmLabel: 'Log out',
      danger: true,
    });
    if (!ok) return;
    logout();
    navigate('/admin/login');
  }

  function linkClass({ isActive }) {
    return isActive ? 'active' : '';
  }

  return (
    <div className="app-shell">
      <div className="topbar">
        <div className="topbar-head">
          <div className="topbar-brand">
            Admin page of <span>{admin?.tuitionClassName || ''}</span>
          </div>
          <button
            type="button"
            className="topbar-toggle"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
        <nav className={`topbar-nav ${menuOpen ? 'open' : ''}`}>
          <NavLink to="/admin/dashboard" className={linkClass} onClick={() => setMenuOpen(false)}>
            Dashboard
          </NavLink>
          <NavLink to="/admin/students" className={linkClass} onClick={() => setMenuOpen(false)}>
            Students
          </NavLink>
          <NavLink to="/admin/attendance" className={linkClass} onClick={() => setMenuOpen(false)}>
            Attendance
          </NavLink>
          <NavLink to="/admin/exams" className={linkClass} onClick={() => setMenuOpen(false)}>
            Exams
          </NavLink>
          <NavLink to="/admin/notes" className={linkClass} onClick={() => setMenuOpen(false)}>
            Notes
          </NavLink>
          <NavLink to="/admin/notices" className={linkClass} onClick={() => setMenuOpen(false)}>
            Notices
          </NavLink>
          <NavLink to="/admin/recordings" className={linkClass} onClick={() => setMenuOpen(false)}>
            Recordings
          </NavLink>
          <button onClick={handleLogout}>Log out</button>
        </nav>
      </div>
      <div className="page-body">{children}</div>
    </div>
  );
}
