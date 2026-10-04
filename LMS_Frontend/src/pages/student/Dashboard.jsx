import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStudentAuth } from '../../context/StudentAuthContext';
import { useConfirm } from '../../context/ConfirmDialogContext';
import * as endpoints from '../../api/endpoints';
import MarksChart from '../../components/MarksChart';
import NoticeBell from '../../components/NoticeBell';
import { IconExam, IconChartBar, IconTrophy, IconCheckCircle } from '../../components/icons';
import { getYoutubeEmbedUrl } from '../../utils/youtube';
import { getFileDisplay, formatUploaded } from '../../utils/fileType';
import { IconFilePdf, IconImage, IconDownload } from '../../components/icons';

export default function StudentDashboard() {
  const { student, logout } = useStudentAuth();
  const navigate = useNavigate();
  const confirm = useConfirm();
  const [results, setResults] = useState([]);
  const [attendance, setAttendance] = useState(null);
  const [profile, setProfile] = useState(null);
  const [videos, setVideos] = useState([]);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAllResults, setShowAllResults] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    Promise.all([
      endpoints.getMyResults(),
      endpoints.getMyAttendance(),
      endpoints.getMyProfile(),
      endpoints.getMyVideos(),
      endpoints.getMyNotes(),
    ])
      .then(([resultsRes, attendanceRes, profileRes, videosRes, notesRes]) => {
        setResults(resultsRes.data.results);
        setAttendance(attendanceRes.data);
        setProfile(profileRes.data);
        setVideos(videosRes.data.videos);
        setNotes(notesRes.data.notes);
      })
      .catch((err) => setError(err.response?.data?.error || 'Could not load your dashboard.'))
      .finally(() => setLoading(false));
  }, []);

  async function handleLogout() {
    setMenuOpen(false);
    const ok = await confirm({
      title: 'Log out?',
      message: "You'll need to log in again to access your dashboard.",
      confirmLabel: 'Log out',
      danger: true,
    });
    if (!ok) return;
    logout();
    navigate('/student/login');
  }

  // Percentages normalize scores across exams with different max marks, so
  // the chart and averages are comparable exam-to-exam. The chart's x-axis
  // reads by date (not exam name) — label stays the exam title for the
  // hover tooltip, xLabel is what shows under each bar.
  const withPercentage = results.map((r) => ({
    label: r.exam.title,
    xLabel: new Date(r.exam.examDate).toLocaleDateString(),
    subject: r.exam.subject,
    marksObtained: r.marksObtained,
    maxMarks: r.exam.maxMarks,
    percentage: (r.marksObtained / r.exam.maxMarks) * 100,
  }));

  const averagePercentage = withPercentage.length
    ? Math.round(withPercentage.reduce((sum, r) => sum + r.percentage, 0) / withPercentage.length)
    : null;

  const bestResult = withPercentage.length
    ? withPercentage.reduce((best, r) => (r.percentage > best.percentage ? r : best))
    : null;

  // Chart reads left-to-right as oldest-to-newest, which matches how a
  // student thinks about "my progress over time"; the table below stays
  // newest-first since that's what you want to see right after a release.
  const chartData = [...withPercentage].reverse();

  const RESULTS_PREVIEW_COUNT = 5;
  const visibleResults = showAllResults ? results : results.slice(0, RESULTS_PREVIEW_COUNT);

  return (
    <div className="app-shell">
      <div className="topbar">
        <div className="topbar-head">
          <div className="topbar-brand">
            My<span>Class</span>.edu.lk
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
          <a href="#notes" onClick={() => setMenuOpen(false)}>Notes</a>
          <a href="#recordings" onClick={() => setMenuOpen(false)}>Recordings</a>
          <NoticeBell />
          <button className="topbar-logout-btn" onClick={handleLogout}>Log out</button>
        </nav>
      </div>
      <div className="page-body">
        <div className={profile?.posterImageUrl ? 'poster-hero' : 'page-header'}>
          {profile?.posterImageUrl && (
            <div className="poster-hero-image">
              <img src={profile.posterImageUrl} alt={profile.tuitionClassName || 'Class poster'} />
            </div>
          )}
          <div className={profile?.posterImageUrl ? 'poster-hero-content' : undefined}>
            <h1>Hi, {student?.fullName}</h1>
            {profile?.tuitionClassName && <p className="poster-hero-class">{profile.tuitionClassName}</p>}
            <p className="muted text-sm">
              Student number: <span className="student-number">{student?.studentNumber}</span>
              {profile?.school && <> | School: {profile.school}</>}
            </p>
          </div>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {loading ? (
          <p className="muted spacer-top">Loading...</p>
        ) : (
          <>
            <div className="stat-grid spacer-top">
              <div className="stat-card stat-card--icon">
                <span className="stat-icon-badge stat-icon-badge--ink">
                  <IconExam />
                </span>
                <div>
                  <div className="stat-label">Exams taken</div>
                  <div className="stat-value">{withPercentage.length}</div>
                </div>
              </div>
              <div className="stat-card stat-card--icon">
                <span className="stat-icon-badge stat-icon-badge--red">
                  <IconChartBar />
                </span>
                <div>
                  <div className="stat-label">Average score</div>
                  <div className="stat-value">{averagePercentage === null ? '—' : `${averagePercentage}%`}</div>
                </div>
              </div>
              <div className="stat-card stat-card--icon">
                <span className="stat-icon-badge stat-icon-badge--gold">
                  <IconTrophy />
                </span>
                <div>
                  <div className="stat-label">Best result</div>
                  <div className="stat-value">{bestResult ? `${Math.round(bestResult.percentage)}%` : '—'}</div>
                </div>
              </div>
              <div className="stat-card stat-card--icon">
                <span className="stat-icon-badge stat-icon-badge--green">
                  <IconCheckCircle />
                </span>
                <div>
                  <div className="stat-label">Attendance</div>
                  <div className="stat-value">{attendance ? `${attendance.summary.percentage}%` : '—'}</div>
                </div>
              </div>
            </div>

            <div className="sheet-card">
              <h3>Your results</h3>
              {results.length === 0 ? (
                <p className="muted">No published results yet. Check back once your admin releases one.</p>
              ) : (
                <div className="table-card">
                  <table className="mark-table">
                    <thead>
                      <tr>
                        <th>Exam</th>
                        <th>Subject</th>
                        <th>Date</th>
                        <th>Marks</th>
                        <th>Rank</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Results come back newest-first, so the latest release is
                          always the first row — call it out so it doesn't get lost
                          among older ones. */}
                      {visibleResults.map((r, i) => (
                        <tr key={r.exam.id} className={i === 0 ? 'row-highlight' : undefined}>
                          <td data-label="Exam">
                            <span>
                              {r.exam.title}
                              {i === 0 && <span className="stamp stamp-latest">Latest</span>}
                            </span>
                          </td>
                          <td className="muted" data-label="Subject">{r.exam.subject}</td>
                          <td className="muted" data-label="Date">{new Date(r.exam.examDate).toLocaleDateString()}</td>
                          <td data-label="Marks">
                            <span className="score-red">
                              {r.marksObtained} / {r.exam.maxMarks}
                            </span>
                          </td>
                          <td data-label="Rank">
                            <span className="rank-badge rank-badge--sm">{r.rank}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {results.length > RESULTS_PREVIEW_COUNT && (
                <button
                  type="button"
                  className="btn btn-ghost btn-sm spacer-top"
                  onClick={() => setShowAllResults((show) => !show)}
                >
                  {showAllResults ? 'Show less' : `Show more (${results.length - RESULTS_PREVIEW_COUNT} more)`}
                </button>
              )}
            </div>

            <div className="dashboard-grid spacer-top">
              <div className="sheet-card">
                <h3>Performance Chart</h3>
                {withPercentage.length === 0 ? (
                  <p className="muted">No published results yet. Check back once your admin releases one.</p>
                ) : (
                  <MarksChart data={chartData} />
                )}
              </div>

              <div className="sheet-card">
                <h3>Attendance</h3>
                {!attendance || attendance.summary.totalDays === 0 ? (
                  <p className="muted">No attendance marked yet.</p>
                ) : (
                  <>
                    <div className="attendance-bar">
                      <div
                        className="attendance-bar-present"
                        style={{ width: `${attendance.summary.percentage}%` }}
                      />
                      <div
                        className="attendance-bar-absent"
                        style={{ width: `${100 - attendance.summary.percentage}%` }}
                      />
                    </div>
                    <div className="attendance-legend">
                      <span>
                        <i className="legend-dot legend-dot--green" aria-hidden="true" />
                        Present ({attendance.summary.presentDays})
                      </span>
                      <span>
                        <i className="legend-dot legend-dot--red" aria-hidden="true" />
                        Absent ({attendance.summary.totalDays - attendance.summary.presentDays})
                      </span>
                    </div>
                    <p className="muted text-sm spacer-top">
                      Marked on {attendance.summary.totalDays} day{attendance.summary.totalDays === 1 ? '' : 's'} so far.
                    </p>
                  </>
                )}
              </div>
            </div>

            <div id="notes" className="sheet-card spacer-top">
              <h3>Notes</h3>
              {notes.length === 0 ? (
                <p className="muted">No notes uploaded yet.</p>
              ) : (
                <div className="note-card-grid">
                  {notes.map((n) => {
                    const display = getFileDisplay(n.fileType);
                    return (
                      <div key={n.id} className="note-card">
                        <div className={`note-row-icon note-row-icon--${display.kind}`}>
                          {display.kind === 'image' ? <IconImage /> : <IconFilePdf />}
                        </div>
                        <div className="note-card-body">
                          <div className="note-row-title-line">
                            <span className="note-row-title">{n.title}</span>
                            <span className="note-row-badge">{display.label}</span>
                          </div>
                          <p className="note-row-meta">Uploaded {formatUploaded(n.uploadedAt)}</p>
                        </div>
                        <a href={n.fileUrl} target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm note-card-download">
                          <IconDownload /> Download
                        </a>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div id="recordings" className="sheet-card spacer-top">
              <h3>Recordings</h3>
              {videos.length === 0 ? (
                <p className="muted">No class recordings uploaded yet.</p>
              ) : (
                <div className="video-grid">
                  {videos.map((v) => (
                    <div key={v.id} className="video-card">
                      <div className="video-embed">
                        <iframe
                          src={getYoutubeEmbedUrl(v.youtubeUrl)}
                          title={v.title}
                          loading="lazy"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                      <div className="video-card-body">
                        <p className="video-card-title">{v.title}</p>
                        <p className="muted text-sm">{new Date(v.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
