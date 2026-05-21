// src/pages/organizer/event/EventListPage.jsx
import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { EventService } from "../../../services/EventService";
import "./EventListPage.css";

const STATUSES = ["all", "draft", "published", "cancelled"];
const STATUS_LABELS = {
  all: "Tất cả",
  draft: "Nháp",
  published: "Đã đăng",
  cancelled: "Đã huỷ",
};

// ── Status badge ──────────────────────────────────────────────
function StatusBadge({ status }) {
  const labels = { published: "Đã đăng", draft: "Nháp", cancelled: "Huỷ" };
  return <span className={`badge badge--${status}`}>{labels[status] ?? status}</span>;
}

// ── Fill rate bar ─────────────────────────────────────────────
function FillBar({ rate }) {
  return (
    <div className="fill-bar">
      <div className="fill-bar__track">
        <div className="fill-bar__fill" style={{ width: `${rate}%` }} />
      </div>
      <span className="fill-bar__pct">{rate}%</span>
    </div>
  );
}

// ── Format date ───────────────────────────────────────────────
function formatDate(dateString) {
  if (!dateString) return "—";
  try {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return "—";
  }
}

// ── Table Row ─────────────────────────────────────────────────
function EventRow({ ev }) {
  if (!ev) return null;

  const {
    id,
    title = "Không có tiêu đề",
    category = "Chưa phân loại",
    event_date,
    capacity = 0,
    confirmed_count = 0,
    fill_rate = 0,
    status = "draft",
  } = ev;

  return (
    <tr>
      <td className="ev-table__title">
        <span className="ev-table__link">{title}</span>
      </td>
      <td>
        <span className="cat-tag">{category}</span>
      </td>
      <td className="ev-table__date">{formatDate(event_date)}</td>
      <td>
        {confirmed_count}
        <span className="ev-table__cap">/{capacity}</span>
      </td>
      <td>
        <FillBar rate={Math.min(fill_rate, 100)} />
      </td>
      <td>
        <StatusBadge status={status} />
      </td>
      <td style={{ display: 'flex', gap: '8px' }}>
        <Link to={`/organizer/events/${id}/edit`} className="events-page__edit-btn">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
          Sửa
        </Link>
        <Link to={`/organizer/events/${id}/attendees`} className="events-page__edit-btn" style={{ background: '#e0f2fe', color: '#0284c7' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          Attendees
        </Link>
      </td>
    </tr>
  );
}

// ── Main Page ─────────────────────────────────────────────────
export default function EventListPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Fetch events on mount
  useEffect(() => {
    setLoading(true);
    setError("");
    EventService.getEvents()
      .then((res) => {
        const data = res?.data ?? res ?? [];
        setEvents(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Lỗi tải danh sách sự kiện:", err);
        setError(err?.response?.data?.message || "Không thể tải danh sách sự kiện.");
      })
      .finally(() => setLoading(false));
  }, []);

  // Filter + search
  const filteredEvents = useMemo(() => {
    return events.filter((ev) => {
      if (!ev) return false;
      const matchStatus = statusFilter === "all" || ev.status === statusFilter;
      const matchSearch =
        !search ||
        ev.title?.toLowerCase().includes(search.toLowerCase()) ||
        ev.category?.toLowerCase().includes(search.toLowerCase()) ||
        ev.location?.toLowerCase().includes(search.toLowerCase());
      return matchStatus && matchSearch;
    });
  }, [events, statusFilter, search]);

  // Counts
  const counts = useMemo(() => {
    const c = { all: events.length, draft: 0, published: 0, cancelled: 0 };
    events.forEach((ev) => {
      if (ev?.status && c[ev.status] !== undefined) c[ev.status]++;
    });
    return c;
  }, [events]);

  return (
    <div className="events-page">
      {/* Header */}
      <div className="events-page__header">
        <div className="events-page__header-left">
          <h1>Quản lý sự kiện</h1>
          <p>Xem, sửa và quản lý tất cả sự kiện của bạn</p>
        </div>
        <Link to="/organizer/create" className="events-page__create-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Tạo sự kiện
        </Link>
      </div>

      {/* Filters */}
      <div className="events-page__filters">
        <input
          type="text"
          className="events-page__search"
          placeholder="🔍 Tìm theo tên, danh mục, địa điểm..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="events-page__filter-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABELS[s]} ({counts[s]})
            </option>
          ))}
        </select>
      </div>

      {/* Error */}
      {error && (
        <div style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", padding: "10px 14px", borderRadius: 8, fontSize: 13, marginBottom: 16 }}>
          {error}
        </div>
      )}

      {/* Table Card */}
      <div className="events-page__card">
        {loading ? (
          <div className="events-page__loading">
            <div className="events-page__spinner" />
            Đang tải sự kiện...
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="events-page__empty">
            <div className="events-page__empty-icon">📭</div>
            <p>{search || statusFilter !== "all" ? "Không tìm thấy sự kiện phù hợp" : "Chưa có sự kiện nào"}</p>
            <Link to="/organizer/create" className="events-page__create-btn">
              Tạo sự kiện đầu tiên
            </Link>
          </div>
        ) : (
          <>
            <div className="events-page__table-wrap">
              <table className="ev-table">
                <thead>
                  <tr>
                    <th>Tên sự kiện</th>
                    <th>Danh mục</th>
                    <th>Ngày</th>
                    <th>Đã đăng ký</th>
                    <th>Tỷ lệ lấp đầy</th>
                    <th>Trạng thái</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEvents.map((ev, index) => (
                    <EventRow key={ev?.id || `event-${index}`} ev={ev} />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary footer */}
            <div className="events-page__summary">
              Hiển thị <span>{filteredEvents.length}</span> / <span>{events.length}</span> sự kiện
            </div>
          </>
        )}
      </div>
    </div>
  );
}
