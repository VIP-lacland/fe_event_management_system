import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChartCard, Skeleton } from "./DashboardUI";
import { UpdateRegistrationStatus } from "../../../../services/EventService";

function PendingRow({ reg, onUpdate }) {
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (status) => {
    setLoading(true);
    try {
      await UpdateRegistrationStatus(reg.event_id, reg.id, status);
      onUpdate(reg.id, status);
    } catch (err) {
      alert(err.response?.data?.message || 'Lỗi cập nhật trạng thái');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <tr>
      <td className="ev-table__title">
        <Link to={`/organizer/events/${reg.event_id}/attendees`} className="ev-table__link">
          {reg.event_title}
        </Link>
      </td>
      <td>{reg.attendee_name}</td>
      <td>{reg.attendee_email}</td>
      <td className="ev-table__date">{formatDate(reg.created_at)}</td>
      <td>
        <span className="badge-pending" style={{ padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: '500', backgroundColor: '#fef08a', color: '#854d0e' }}>
          Pending
        </span>
      </td>
      <td style={{ display: 'flex', gap: '8px' }}>
        <button 
          onClick={() => handleUpdate('confirmed')}
          disabled={loading}
          style={{ background: '#dcfce7', color: '#166534', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: '500', fontSize: '13px' }}
        >
          {loading ? '...' : 'Approve'}
        </button>
        <button 
          onClick={() => handleUpdate('rejected')}
          disabled={loading}
          style={{ background: '#fee2e2', color: '#991b1b', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: '500', fontSize: '13px' }}
        >
          {loading ? '...' : 'Reject'}
        </button>
      </td>
    </tr>
  );
}

export default function PendingRegistrationsTable({ pendingList, loading }) {
  const [localList, setLocalList] = useState(pendingList || []);

  // Sync when props change
  useEffect(() => {
    setLocalList(pendingList || []);
  }, [pendingList]);

  const handleUpdate = (id, newStatus) => {
    // Remove from pending list
    setLocalList(localList.filter(reg => reg.id !== id));
  };

  return (
    <section className="dash__recent" style={{ marginTop: '1.5rem' }}>
      <ChartCard
        title="Yêu cầu phê duyệt (Pending Registrations)"
        action={<span style={{ fontSize: '14px', color: '#64748b' }}>Cần xử lý: {localList.length}</span>}
      >
        {loading ? (
          <Skeleton h={180} r={10} />
        ) : localList.length === 0 ? (
          <div className="ev-table__empty">
            <p>🎉 Không có yêu cầu nào cần duyệt</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table className="ev-table">
              <thead>
                <tr>
                  <th>Sự kiện</th>
                  <th>Người đăng ký</th>
                  <th>Email</th>
                  <th>Ngày đăng ký</th>
                  <th>Trạng thái</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {localList.map((reg) => (
                  <PendingRow key={reg.id} reg={reg} onUpdate={handleUpdate} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </ChartCard>
    </section>
  );
}
