import { Link } from 'react-router-dom';
import PublicNavbar from '../../components/PublicNavbar';
import SiteFooter from '../../components/SiteFooter';
import { IconGraduationCap, IconLock, IconBolt, IconLayers, IconClock } from '../../components/icons';

export default function Home() {
  return (
    <div className="app-shell public-shell">
      <PublicNavbar />

      <div className="hero-banner">
        {/* Drop a photo at LMS_Frontend/public/hero-photo.jpg — it shows
            automatically the moment it's there; until then the gradient
            underneath is the whole background, so there's no empty
            "placeholder" state. */}
        <div className="hero-banner-media">
          <img
            src="/hero-photo.jpeg"
            alt=""
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>

        <div className="hero-banner-content">
          <div>
            <span className="hero-eyebrow">
              <IconGraduationCap /> Student Result Portal
            </span>
            <h1>
              ඔබගේ <em>Digital</em> පන්ති කාමරය.
            </h1>
            <p className="hero-sub">
              පළමුවර Register වීමේදී ඔබගේ ගුරුවරයාගේ උපදෙස් ලබාගන්න.
              <br />
              ඉන්පසු ඔබගේ username සහ password භාවිතා කර login විය හැක.
            </p>

            <div className="hero-actions">
              <Link to="/student/register" className="btn btn-accent">
                Student Registr
              </Link>
              <Link to="/student/login" className="btn btn-ghost">
                Student Login
              </Link>
            </div>
          </div>
        </div>

        <div className="hero-banner-hint">
          myclass.edu.lk 
        </div>
      </div>

      <div className="stat-strip-section">
        <div className="stat-strip">
          <div className="stat-strip-item">
            <span className="stat-strip-icon" aria-hidden="true"><IconLock /></span>
            <span className="stat-strip-label">Your Own<br />Login</span>
          </div>
          <div className="stat-strip-item">
            <span className="stat-strip-icon" aria-hidden="true"><IconBolt /></span>
            <span className="stat-strip-label">Instant<br />Results</span>
          </div>
          <div className="stat-strip-item">
            <span className="stat-strip-icon" aria-hidden="true"><IconLayers /></span>
            <span className="stat-strip-label">Shared<br />Notes</span>
          </div>
          <div className="stat-strip-item">
            <span className="stat-strip-icon" aria-hidden="true"><IconClock /></span>
            <span className="stat-strip-label">24/7<br />Access</span>
          </div>
        </div>
      </div>

      <div className="steps-section">
        <h2>How it works</h2>
        <p className="features-subtitle">Three steps, no paperwork, no waiting for a printed sheet.</p>
        <div className="step-grid">
          <div className="step-card">
            <span className="step-number">1</span>
            <h3>Your admin adds you to the class</h3>
            <p className="text-sm muted">
              Your tuition class admin gives you a student number and a class join code.
            </p>
          </div>
          <div className="step-card">
            <span className="step-number">2</span>
            <h3>You create your own login</h3>
            <p className="text-sm muted">
              Use your student number and the join code once, to set your own username and password.
            </p>
          </div>
          <div className="step-card">
            <span className="step-number">3</span>
            <h3>Log in, anytime</h3>
            <p className="text-sm muted">
              See your marks, rank, class average, attendance and shared notes whenever you like.
            </p>
          </div>
        </div>
      </div>

      <div className="features-section">
        <h2>Built for students, run by your tutor</h2>
        <p className="features-subtitle">Everything a tuition class actually needs — nothing built for schools twice your size.</p>
        <div className="feature-grid">
          <div className="feature-card">
            <span className="feature-icon">Results</span>
            <h3>Your own secure login</h3>
            <p className="text-sm muted">
              Create your account once with your admin's join code — no one else can see your results.
            </p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">Access</span>
            <h3>A dashboard just for you</h3>
            <p className="text-sm muted">
              Track every result over time, not just the latest one, with rank and class average included.
            </p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">Notes</span>
            <h3>Shared class notes</h3>
            <p className="text-sm muted">
              Download PDFs, images, and slides your tutor uploads — anytime, from any device.
            </p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">Attendance</span>
            <h3>Attendance on record</h3>
            <p className="text-sm muted">
              Presence is tracked per class, with an automatic percentage summary.
            </p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">Exams</span>
            <h3>Exams &amp; marks</h3>
            <p className="text-sm muted">
              Every exam your class sits, with marks entered once and published when ready.
            </p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">Students</span>
            <h3>One record per student</h3>
            <p className="text-sm muted">
              Your details, contact info and history live in one place for your tutor to manage.
            </p>
          </div>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
