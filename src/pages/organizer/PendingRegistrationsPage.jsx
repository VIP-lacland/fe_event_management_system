import React from "react";
import useDashboard from "./dashboard/hooks/useDashboard";
import PendingRegistrationsTable from "./dashboard/components/PendingRegistrationsTable";
import "./dashboard/Dashboard.css"; // Reuse dashboard styles

function PageHeader() {
  const today = new Date().toLocaleDateString("vi-VN", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  return (
    <header className="dash__header">
      <div>
        <h1 className="dash__title">Yêu cầu phê duyệt</h1>
        <p className="dash__sub">Quản lý các lượt đăng ký đang chờ duyệt của tất cả sự kiện</p>
      </div>
      <div className="dash__date">{today}</div>
    </header>
  );
}

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

export default function PendingRegistrationsPage() {
  // We reuse the useDashboard hook as it already fetches pending_registrations
  const { data, loading, error, refetch } = useDashboard();

  return (
    <div className="dash">
      <PageHeader />

      {error && <ErrorBanner message={error} onRetry={refetch} />}

      <PendingRegistrationsTable 
        pendingList={data?.pending_registrations} 
        loading={loading} 
      />
    </div>
  );
}
