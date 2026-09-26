import { useState } from 'react';

// A single-series bar chart of exam scores as a percentage of max marks —
// plain HTML/CSS bars (no chart library needed for one series). Each bar
// gets a hover tooltip with the exact marks; scores are also direct-labeled
// above the bar as long as there aren't so many exams that it gets noisy.
export default function MarksChart({ data }) {
  const [hoverIndex, setHoverIndex] = useState(null);

  if (!data.length) return null;

  const showDirectLabels = data.length <= 8;

  return (
    <div className="marks-chart">
      <div className="marks-chart-plot">
        {[100, 75, 50, 25, 0].map((tick) => (
          <div key={tick} className="marks-chart-gridline" style={{ bottom: `${tick}%` }}>
            <span className="marks-chart-tick">{tick}</span>
          </div>
        ))}
        <div className="marks-chart-bars">
          {data.map((d, i) => (
            <div
              key={i}
              className="marks-chart-bar-col"
              onMouseEnter={() => setHoverIndex(i)}
              onMouseLeave={() => setHoverIndex(null)}
              onFocus={() => setHoverIndex(i)}
              onBlur={() => setHoverIndex(null)}
              tabIndex={0}
            >
              {hoverIndex === i && (
                <div className="marks-chart-tooltip" role="tooltip">
                  <strong>{d.label}</strong>
                  <span className="muted">{d.subject}</span>
                  <span className="score-red">
                    {d.marksObtained} / {d.maxMarks} ({Math.round(d.percentage)}%)
                  </span>
                </div>
              )}
              <div
                className="marks-chart-bar"
                style={{ height: `${Math.max(d.percentage, 2)}%` }}
              >
                {showDirectLabels && (
                  <span className="marks-chart-value">{Math.round(d.percentage)}%</span>
                )}
              </div>
              <span className="marks-chart-label" title={d.label}>
                {d.xLabel}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
