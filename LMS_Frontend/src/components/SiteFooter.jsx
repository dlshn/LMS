import { Link } from 'react-router-dom';

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="topbar-brand" style={{ color: 'var(--color-ink)' }}>
          My<span>Class</span>.edu.lk
        </div>
        <nav className="site-footer-links">
          <Link to="/student/login">Student Login</Link>
          <Link to="/student/register">Student Register</Link>
          <span className="site-footer-divider" aria-hidden="true" />
          <Link to="/help">Help</Link>
          <Link to="/contact">Contact</Link>
          <span className="site-footer-divider" aria-hidden="true" />
          <Link to="/admin/login">Admin Login</Link>
          <Link to="/admin/register">Register your class</Link>
        </nav>
        <p className="muted text-sm">&copy; {new Date().getFullYear()} MyClass.edu.lk</p>
      </div>
    </footer>
  );
}
