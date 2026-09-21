import { useState } from 'react';
import { Link } from 'react-router-dom';
import PublicNavbar from '../../components/PublicNavbar';
import * as endpoints from '../../api/endpoints';

export default function CheckResult() {
  const [studentNumber, setStudentNumber] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setResult(null);
    setLoading(true);
    try {
      // 🎯 නිවැරදි කිරීම: api/endpoints හි ඇති නිවැරදි function නම භාවිත කිරීම
      const { data } = await endpoints.getPublicResultByNumber(studentNumber.trim()); 
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Could not find a published result.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app-shell">
      <PublicNavbar />
      <div className="centered-page">
        <div className="sheet-card auth-card" style={{ maxWidth: 440 }}>
          <span className="auth-eyebrow">Result release</span>
          <h1>Check your result</h1>
          <p className="muted text-sm">
            No login needed. Ask your tuition class admin for your Tuition Class ID if you don't have it.
          </p>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label>Your student number</label>
              <input
                value={studentNumber}
                onChange={(e) => setStudentNumber(e.target.value)}
                placeholder="S001"
                required
              />
            </div>
            <button type="submit" className="btn btn-accent btn-block" disabled={loading}>
              {loading ? 'Checking...' : 'Check result'}
            </button>
          </form>

          {result && (
            <div className="spacer-top sheet-card sheet-card--ruled" style={{ borderLeftColor: 'var(--color-approve)' }}>
              <span className="stamp stamp-published">Published</span>
              <h3 style={{ marginTop: 10 }}>{result.exam.title}</h3>
              <p className="muted text-sm">
                {result.exam.subject} &middot; {new Date(result.exam.examDate).toLocaleDateString()}
              </p>
              <p style={{ margin: '14px 0' }}>
                <span className="rank-badge">Rank: {result.myResult.rank}</span>{' '}
                <span className="score-red" style={{ fontSize: '1.3rem', marginLeft: 10 }}>
                  {result.myResult.marksObtained} / {result.exam.maxMarks}
                </span>
              </p>
              
              {/* 🎯 නිවැරදි කිරීම: Backend එකෙන් එන නියම Keys (averageMarks, highestMarks, totalStudents) පෙන්වීම */}
              <p className="muted text-sm">
                Class average: {result.classStats.averageMarks} &middot; 
                Highest: {result.classStats.highestMarks} &middot; 
                Class size: {result.classStats.totalStudents}
              </p>
            </div>
          )}

          <p className="text-sm spacer-top">
            Prefer to log in? <Link to="/student/login">Student login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
