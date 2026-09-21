import { NavLink, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';

export default function AdminLayout({ children }) {
  const { admin, logout } = useAdminAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/admin/login');
  }

  return (
    <div className="app-shell">
      <div className="topbar">
        <div className="topbar-brand">
          STLMS <span>{admin?.tuitionClassName || ''}</span>
        </div>
        <nav className="topbar-nav">
          <NavLink to="/admin/dashboard" className={({ isActive }) => (isActive ? 'active' : '')}>
            Dashboard
          </NavLink>
          <NavLink to="/admin/students" className={({ isActive }) => (isActive ? 'active' : '')}>
            Students
          </NavLink>
          <NavLink to="/admin/attendance" className={({ isActive }) => (isActive ? 'active' : '')}>
            Attendance
          </NavLink>
          <NavLink to="/admin/exams" className={({ isActive }) => (isActive ? 'active' : '')}>
            Exams
          </NavLink>
          <NavLink to="/admin/notes" className={({ isActive }) => (isActive ? 'active' : '')}>
            Notes
          </NavLink>
          <button onClick={handleLogout}>Log out</button>
        </nav>
      </div>
      <div className="page-body">{children}</div>
    </div>
  );
}
