// A single accent arc over a neutral track, not two competing saturated
// colors for present/absent — the percentage in the center plus the
// legend below already say "absent" without a second loud arc fighting
// the first one for attention.
const SIZE = 160;
const STROKE = 16;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function AttendanceDonut({ percentage }) {
  const offset = CIRCUMFERENCE * (1 - percentage / 100);

  return (
    <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} role="img" aria-label={`${percentage}% attendance`}>
      <circle
        cx={SIZE / 2}
        cy={SIZE / 2}
        r={RADIUS}
        fill="none"
        stroke="var(--color-border)"
        strokeWidth={STROKE}
      />
      <circle
        cx={SIZE / 2}
        cy={SIZE / 2}
        r={RADIUS}
        fill="none"
        stroke="var(--color-approve)"
        strokeWidth={STROKE}
        strokeLinecap="round"
        strokeDasharray={CIRCUMFERENCE}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
        style={{ transition: 'stroke-dashoffset 0.4s ease' }}
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        className="attendance-donut-value"
      >
        {percentage}%
      </text>
    </svg>
  );
}
