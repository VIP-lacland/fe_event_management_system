// src/pages/organizer/dashboard/OrganizerDashboard.jsx

import useDashboard        from "./hooks/useDashboard";
import MetricSection       from "./components/MetricSection";
import ChartSection        from "./components/ChartSection";
import RecentEventsTable   from "./components/RecentEventsTable";
import "./Dashboard.css";

// ── Header ────────────────────────────────────────────────────────
function DashboardHeader() {
  const today = new Date().toLocaleDateString("vi-VN", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  return (
    <header className="dash__header">
      <div>
        <h1 className="dash__title">Dashboard</h1>
        <p className="dash__sub">Tổng quan hoạt động sự kiện của bạn</p>
      </div>
      <div className="dash__date">{today}</div>
    </header>
  );
}

// ── Error banner ──────────────────────────────────────────────────
function ErrorBanner({ message, onRetry }) {
  return (
    <div className="dash__error">
      ⚠ {message}
      {onRetry && (
        <button className="dash__retry" onClick={onRetry}>
          Thử lại
        </button>
      )}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────
export default function OrganizerDashboard() {
  const { data, loading, error, refetch } = useDashboard();

  const metrics = data?.metrics      ?? {};
  const charts  = data?.charts       ?? {};
  const recent  = data?.recent_events ?? [];

  return (
    <div className="dash">
      <DashboardHeader />

      {error && <ErrorBanner message={error} onRetry={refetch} />}

      <MetricSection    metrics={metrics} loading={loading} />
      <ChartSection     charts={charts}   loading={loading} />
      <RecentEventsTable events={recent}  loading={loading} />
    </div>
  );
}