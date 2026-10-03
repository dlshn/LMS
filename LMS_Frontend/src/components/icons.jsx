// Small monoline stat icons — plain inline SVG so there's no icon-font or
// library dependency for four icons. stroke="currentColor" so each one
// just inherits whatever color its .stat-icon-badge--* wrapper sets.
const common = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

export function IconExam(props) {
  return (
    <svg {...common} width="22" height="22" aria-hidden="true" {...props}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <line x1="8" y1="13" x2="16" y2="13" />
      <line x1="8" y1="17" x2="13" y2="17" />
    </svg>
  );
}

export function IconChartBar(props) {
  return (
    <svg {...common} width="22" height="22" aria-hidden="true" {...props}>
      <line x1="4" y1="20" x2="4" y2="14" />
      <line x1="10" y1="20" x2="10" y2="9" />
      <line x1="16" y1="20" x2="16" y2="4" />
      <line x1="2" y1="20" x2="22" y2="20" />
    </svg>
  );
}

export function IconTrophy(props) {
  return (
    <svg {...common} width="22" height="22" aria-hidden="true" {...props}>
      <path d="M8 21h8" />
      <path d="M12 17v4" />
      <path d="M7 4h10v5a5 5 0 0 1-10 0z" />
      <path d="M7 5H4.5a2 2 0 0 0 0 4H6" />
      <path d="M17 5h2.5a2 2 0 0 1 0 4H18" />
    </svg>
  );
}

export function IconCheckCircle(props) {
  return (
    <svg {...common} width="22" height="22" aria-hidden="true" {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12.5l2.5 2.5L16 9.5" />
    </svg>
  );
}

export function IconEye(props) {
  return (
    <svg {...common} width="18" height="18" aria-hidden="true" {...props}>
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function IconGraduationCap(props) {
  return (
    <svg {...common} width="16" height="16" aria-hidden="true" {...props}>
      <path d="M2 9l10-5 10 5-10 5-10-5z" />
      <path d="M6 11.5v4c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5v-4" />
      <path d="M22 9v6" />
    </svg>
  );
}

export function IconLock(props) {
  return (
    <svg {...common} width="20" height="20" aria-hidden="true" {...props}>
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  );
}

export function IconBolt(props) {
  return (
    <svg {...common} width="20" height="20" aria-hidden="true" {...props}>
      <polygon points="13 2 4 14 11 14 10 22 20 10 13 10 13 2" />
    </svg>
  );
}

export function IconLayers(props) {
  return (
    <svg {...common} width="20" height="20" aria-hidden="true" {...props}>
      <polygon points="12 2 22 8 12 14 2 8 12 2" />
      <polyline points="2 14 12 20 22 14" />
      <polyline points="2 11 12 17 22 11" />
    </svg>
  );
}

export function IconClock(props) {
  return (
    <svg {...common} width="20" height="20" aria-hidden="true" {...props}>
      <circle cx="12" cy="12" r="9" />
      <polyline points="12 7 12 12 15 14" />
    </svg>
  );
}

export function IconPhone(props) {
  return (
    <svg {...common} width="20" height="20" aria-hidden="true" {...props}>
      <path d="M4 3h4l2 5-2.5 1.5a11 11 0 0 0 5 5L14 12l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 2 5a2 2 0 0 1 2-2z" />
    </svg>
  );
}

export function IconMail(props) {
  return (
    <svg {...common} width="20" height="20" aria-hidden="true" {...props}>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M2 6l10 7 10-7" />
    </svg>
  );
}

export function IconHelpCircle(props) {
  return (
    <svg {...common} width="16" height="16" aria-hidden="true" {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9a2.5 2.5 0 0 1 4.8 1c0 1.5-2.3 1.8-2.3 3.3" />
      <line x1="12" y1="17" x2="12" y2="17.1" />
    </svg>
  );
}

export function IconBell(props) {
  return (
    <svg {...common} width="20" height="20" aria-hidden="true" {...props}>
      <path d="M6 8a6 6 0 0 1 12 0c0 4 1.5 5.5 2 6H4c.5-.5 2-2 2-6z" />
      <path d="M10 19a2 2 0 0 0 4 0" />
    </svg>
  );
}

export function IconTrash(props) {
  return (
    <svg {...common} width="16" height="16" aria-hidden="true" {...props}>
      <polyline points="3 6 5 6 21 6" />
      <path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2m2 0v14a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V6h12z" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  );
}

export function IconDownload(props) {
  return (
    <svg {...common} width="18" height="18" aria-hidden="true" {...props}>
      <path d="M12 3v12" />
      <polyline points="7 11 12 16 17 11" />
      <path d="M4 19h16" />
    </svg>
  );
}

export function IconFilePdf(props) {
  return (
    <svg {...common} width="20" height="20" aria-hidden="true" {...props}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
    </svg>
  );
}

export function IconImage(props) {
  return (
    <svg {...common} width="20" height="20" aria-hidden="true" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="M21 15l-5-5L5 21" />
    </svg>
  );
}

export function IconShieldCheck(props) {
  return (
    <svg {...common} width="20" height="20" aria-hidden="true" {...props}>
      <path d="M12 2l8 3v6c0 5-3.4 8.4-8 11-4.6-2.6-8-6-8-11V5z" />
      <path d="M8.5 12l2.5 2.5L16 9" />
    </svg>
  );
}

export function IconTrendingUp(props) {
  return (
    <svg {...common} width="20" height="20" aria-hidden="true" {...props}>
      <polyline points="3 17 9 11 13 15 21 6" />
      <polyline points="14 6 21 6 21 13" />
    </svg>
  );
}

export function IconBookOpen(props) {
  return (
    <svg {...common} width="20" height="20" aria-hidden="true" {...props}>
      <path d="M12 6c-2-1.5-5-2-8-1.5v13c3-0.5 6 0 8 1.5 2-1.5 5-2 8-1.5v-13c-3-0.5-6 0-8 1.5z" />
      <line x1="12" y1="6" x2="12" y2="19" />
    </svg>
  );
}

export function IconUsers(props) {
  return (
    <svg {...common} width="22" height="22" aria-hidden="true" {...props}>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20c0-3.3 2.9-6 6.5-6s6.5 2.7 6.5 6" />
      <circle cx="17" cy="9" r="2.8" />
      <path d="M15 14.2c2.6.4 4.5 2.4 4.5 5.3" />
    </svg>
  );
}

export function IconEdit(props) {
  return (
    <svg {...common} width="22" height="22" aria-hidden="true" {...props}>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />
    </svg>
  );
}

export function IconCopy(props) {
  return (
    <svg {...common} width="16" height="16" aria-hidden="true" {...props}>
      <rect x="9" y="9" width="12" height="12" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

export function IconEyeOff(props) {
  return (
    <svg {...common} width="18" height="18" aria-hidden="true" {...props}>
      <path d="M17.7 17.7A11 11 0 0 1 12 19c-7 0-11-7-11-7a19 19 0 0 1 4.6-5.4" />
      <path d="M9.9 5.2A10.6 10.6 0 0 1 12 5c7 0 11 7 11 7a19 19 0 0 1-2.2 3.1" />
      <path d="M14.1 14.1a3 3 0 1 1-4.2-4.2" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}
