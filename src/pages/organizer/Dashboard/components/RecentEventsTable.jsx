import { ChartCard, StatusBadge, Skeleton } from "./DashboardUI";
import { Link } from "react-router-dom";

// ── Fill rate progress bar 
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

// ── Table row 
function EventRow({ ev }) {
  if (!ev) {
    console.warn("EventRow nhận ev = undefined");
    return null;
  }

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

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    try {
      return new Date(dateString).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch (error) {
      console.error("Lỗi format date:", dateString, error);
      return "Ngày không hợp lệ";
    }
  };

  return (
    <tr>
      <td className="ev-table__title">
        <Link to={`/organizer/events/${id}`} className="ev-table__link">
          {title}
        </Link>
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
    </tr>
  );
}

// ── Export RecentEventsTable 
export default function RecentEventsTable({ events, loading }) {
  // ✅ FIX 1: Debug log
  console.log("📦 recent_events từ API:", events);

  // ✅ FIX 2: Đảm bảo events là mảng và lọc bỏ phần tử undefined/null
  const safeEvents = Array.isArray(events)
    ? events.filter((ev) => ev != null) // Loại bỏ null và undefined
    : [];

  console.log("✅ safeEvents sau khi lọc:", safeEvents);

  return (
    <section className="dash__recent">
      <ChartCard
        title="Sự kiện gần đây"
        action={
          <Link to="/organizer/events" className="chart-card__link">
            Xem tất cả →
          </Link>
        }
      >
        {loading ? (
          <Skeleton h={180} r={10} />
        ) : safeEvents.length === 0 ? (
          // ✅ FIX 3: Hiển thị khi không có sự kiện
          <div className="ev-table__empty">
            <p>📭 Chưa có sự kiện nào</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table className="ev-table">
              <thead>
                <tr>
                  <th>Tên sự kiện</th>
                  <th>Danh mục</th>
                  <th>Ngày</th>
                  <th>Đã đăng ký</th>
                  <th>Số lượng đăng ký</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {/* ✅ FIX 4: Map với key an toàn */}
                {safeEvents.map((ev, index) => (
                  <EventRow key={ev?.id || `event-${index}`} ev={ev} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </ChartCard>
    </section>
  );
}