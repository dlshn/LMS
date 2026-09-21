import { Link, NavLink } from 'react-router-dom';

export default function PublicNavbar() {
  return (
    <div className="topbar">
      <Link to="/" className="topbar-brand" style={{ textDecoration: 'none' }}>
        My<span>Class</span>.edu.lk
      </Link>
      <nav className="topbar-nav">
        <NavLink to="/check-result" className={({ isActive }) => (isActive ? 'active' : '')}>
          Check Result
        </NavLink>
        <NavLink to="/student/login" className={({ isActive }) => (isActive ? 'active' : '')}>
          Student Login
        </NavLink>
        <Link to="/admin/login" className="btn btn-ghost btn-sm" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.3)' }}>
          Admin Login
        </Link>
        <Link to="/admin/register" className="btn btn-accent btn-sm">
          Get Started
        </Link>
      </nav>
    </div>
  );
}
