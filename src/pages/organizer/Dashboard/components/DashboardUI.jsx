// src/pages/organizer/dashboard/components/DashboardUI.jsx
// Các component dùng chung trong dashboard

import { ICONS } from "../dashboardConstants";

// ── SVG Icon
export function Icon({ d, size = 18 }) {
  return (
    <svg
      width={size} height={size}
      viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={2}
      strokeLinecap="round" strokeLinejoin="round"
    >
      <path d={d} />
    </svg>
  );
}

// ── Skeleton loader 
export function Skeleton({ h = 24, w = "100%", r = 6 }) {
  return (
    <div
      className="skeleton"
      style={{ height: h, width: w, borderRadius: r }}
    />
  );
}

// ── Status badge 
export function StatusBadge({ status }) {
  const labels = {
    published: "Đã đăng",
    draft:     "Nháp",
    cancelled: "Huỷ",
  };
  return (
    <span className={`badge badge--${status}`}>
      {labels[status] ?? status}
    </span>
  );
}

// ── Chart card wrapper 
export function ChartCard({ title, action, children }) {
  return (
    <div className="chart-card">
      <div className="chart-card__head">
        <h2 className="chart-card__title">{title}</h2>
        {action}
      </div>
      {children}
    </div>
  );
}

// ── Recharts custom tooltip 
export function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip__label">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>
          {p.name}: <strong>{p.value}</strong>
        </p>
      ))}
    </div>
  );
}

// ── Metric card ───────────────────────────────────────────────────
export function MetricCard({ label, value, iconKey, accent, delta }) {
  return (
    <div className={`metric-card metric-card--${accent}`}>
      <div className="metric-card__icon">
        <Icon d={ICONS[iconKey]} size={20} />
      </div>
      <div className="metric-card__body">
        <span className="metric-card__label">{label}</span>
        <span className="metric-card__value">{value ?? "—"}</span>
        {delta !== undefined && (
          <span className={`metric-card__delta ${delta >= 0 ? "up" : "dn"}`}>
            {delta >= 0 ? "↑" : "↓"} {Math.abs(delta)} so với tháng trước
          </span>
        )}
      </div>
    </div>
  );
}