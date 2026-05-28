import { Link } from 'react-router-dom';
import './TicketsTable.css';

const TicketsTable = ({ tickets, loading, onCancel, pagination, onFilterChange, currentFilter }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    const config = {
      confirmed: { class: 'status-confirmed', label: 'Confirmed' },
      pending: { class: 'status-pending', label: 'Pending' },
      cancelled: { class: 'status-cancelled', label: 'Cancelled' },
    };
    return config[status] || { class: '', label: status };
  };

  const handlePageChange = (page) => {
    if (onFilterChange) onFilterChange(page, currentFilter);
  };

  if (loading && tickets.length === 0) {
    return <div className="table-loading">Loading your tickets...</div>;
  }

  if (tickets.length === 0) {
    return (
      <div className="tickets-empty">
        <p>You haven't registered for any events yet.</p>
        <Link to="/" className="btn-discover">Discover Events</Link>
      </div>
    );
  }

  return (
    <div className="tickets-table-wrapper">
      {/* Status Filter */}
      <div className="status-filters">
        {[
          { key: null, label: 'All' },
          { key: 'pending', label: 'Pending' },
          { key: 'confirmed', label: 'Confirmed' },
          { key: 'cancelled', label: 'Cancelled' },
        ].map((filter) => (
          <button
            key={filter.key || 'all'}
            className={`filter-btn ${currentFilter === filter.key ? 'active' : ''}`}
            onClick={() => onFilterChange?.(1, filter.key)}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="tickets-table">
          <thead>
            <tr>
              <th className="col-event">Event</th>
              <th className="col-email desktop-only">Email</th>
              <th className="col-date desktop-only">Date</th>
              <th className="col-status">Status</th>
              <th className="col-actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => {
              const event = ticket.event;
              const statusInfo = getStatusBadge(ticket.status);
              const canCancel = ticket.status !== 'cancelled';

              return (
                <tr key={ticket.id} className={ticket.status === 'cancelled' ? 'row-cancelled' : ''}>
                  <td className="col-event">
                    <div className="event-info">
                      <strong className="event-title">{event?.title || 'Unknown Event'}</strong>
                      <span className="event-location">{event?.location}</span>
                    </div>
                  </td>
                  <td className="col-email desktop-only">{ticket.attendee?.email || 'N/A'}</td>
                  <td className="col-date desktop-only">{formatDate(ticket.created_at)}</td>
                  <td className="col-status">
                    <span className={`status-badge ${statusInfo.class}`}>
                      {statusInfo.label}
                    </span>
                  </td>
                  <td className="col-actions">
                    <div className="action-buttons">
                      <Link to={`/event/${event?.id}`} className="btn-view">View</Link>
                      {canCancel && (
                        <button
                          className="btn-cancel"
                          onClick={() => onCancel(ticket.event_id)}
                          disabled={loading}
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && pagination.last_page > 1 && (
        <div className="pagination">
          <button
            className="page-btn"
            onClick={() => handlePageChange(pagination.current_page - 1)}
            disabled={pagination.current_page === 1}
          >
            ← Prev
          </button>
          
          {[...Array(pagination.last_page)].map((_, i) => {
            const page = i + 1;
            // Hiển thị max 5 số trang + ellipsis
            if (
              page === 1 ||
              page === pagination.last_page ||
              (page >= pagination.current_page - 1 && page <= pagination.current_page + 1)
            ) {
              return (
                <button
                  key={page}
                  className={`page-num ${page === pagination.current_page ? 'active' : ''}`}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </button>
              );
            }
            if (page === 2 && pagination.current_page > 3) return <span key="e1">...</span>;
            if (page === pagination.last_page - 1 && pagination.current_page < pagination.last_page - 2) return <span key="e2">...</span>;
            return null;
          })}
          
          <button
            className="page-btn"
            onClick={() => handlePageChange(pagination.current_page + 1)}
            disabled={pagination.current_page === pagination.last_page}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
};

export default TicketsTable;