import { Link } from 'react-router-dom';
import PublicNavbar from '../../components/PublicNavbar';

export default function Home() {
  return (
    <div className="app-shell">
      <PublicNavbar />

      <div className="hero-section">
        <div className="hero-inner">
          <div>
            <span className="hero-eyebrow">For Sri Lankan tuition classes</span>
            <h1>
              Attendance, marks and results — <em>off the exercise book</em>, onto one screen.
            </h1>
            <p className="hero-sub">
              Register your tuition class, manage students, mark attendance, run exams, and let
              students check their own results — by student number, no login needed.
            </p>
            <div className="hero-actions">
              <Link to="/admin/register" className="btn btn-accent">
                Register your class
              </Link>
              <Link to="/check-result" className="btn btn-ghost">
                Check a result
              </Link>
            </div>
          </div>

          <div className="hero-mock">
            <div className="hero-mock-header">
              <span>Term 10 Mathematics</span>
              <span>Published</span>
            </div>
            <div className="hero-mock-row">
              <span>Nimal Silva (S001)</span>
              <span className="score-red">92 / 100</span>
            </div>
            <div className="hero-mock-row">
              <span>Kavindi Perera (S002)</span>
              <span className="score-red">87 / 100</span>
            </div>
            <div className="hero-mock-row">
              <span>Class average</span>
              <span className="muted">73.4</span>
            </div>
          </div>
        </div>
      </div>

      <div className="features-section">
        <h2>Everything a tuition class actually needs</h2>
        <p className="features-subtitle">No clutter, no features built for schools twice your size.</p>
        <div className="feature-grid">
          <div className="feature-card">
            <span className="feature-icon">Students</span>
            <h3>Student records</h3>
            <p className="text-sm muted">
              Register students with a student number, contact details, and login credentials in one place.
            </p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">Attendance</span>
            <h3>Daily attendance</h3>
            <p className="text-sm muted">
              Mark present or absent per class, with automatic percentage summaries per student.
            </p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">Exams</span>
            <h3>Exams &amp; marks</h3>
            <p className="text-sm muted">
              Create an exam, fill in every student's marks on one form, then publish when ready.
            </p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">Results</span>
            <h3>Instant result checking</h3>
            <p className="text-sm muted">
              Students check their own rank and marks by student number — just like an official release.
            </p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">Notes</span>
            <h3>Shared notes</h3>
            <p className="text-sm muted">
              Upload PDFs, images, or slides once — every student can download them anytime.
            </p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">Access</span>
            <h3>Student portal</h3>
            <p className="text-sm muted">
              Students get their own login to track results and progress over time.
            </p>
          </div>
        </div>
      </div>

      <div className="cta-band">
        <h2>Ready to digitize your tuition class?</h2>
        <p className="muted">Takes a few minutes to set up. No cost to get started.</p>
        <Link to="/admin/register" className="btn btn-accent">
          Register your class
        </Link>
      </div>
    </div>
  );
}
