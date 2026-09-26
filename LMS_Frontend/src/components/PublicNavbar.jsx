import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

export default function PublicNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  function linkClass({ isActive }) {
    return isActive ? 'active' : '';
  }

  return (
    <div className="topbar topbar--public">
      <div className="topbar-head">
        <Link to="/" className="topbar-brand" style={{ textDecoration: 'none' }} onClick={() => setMenuOpen(false)}>
          My<span>Class</span>.edu.lk
        </Link>
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
        <NavLink to="/" end className={linkClass} onClick={() => setMenuOpen(false)}>
          Home
        </NavLink>
        <NavLink to="/help" className={linkClass} onClick={() => setMenuOpen(false)}>
          Help
        </NavLink>
        <NavLink to="/contact" className={linkClass} onClick={() => setMenuOpen(false)}>
          Contact
        </NavLink>
        <NavLink to="/student/login" className={linkClass} onClick={() => setMenuOpen(false)}>
          Student Login
        </NavLink>
        <Link to="/student/register" className="btn-pill-accent" onClick={() => setMenuOpen(false)}>
          Student Register
        </Link>
      </nav>
    </div>
  );
}
