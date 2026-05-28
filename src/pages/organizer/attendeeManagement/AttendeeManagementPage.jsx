import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  GetRegistrations,
  UpdateRegistrationStatus,
  GetEventById,
} from "../../../services/EventService";
import "./AttendeeManagementPage.css";

const AttendeeManagementPage = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("pending");

  useEffect(() => {
    fetchData();
  }, [eventId]);

  const filteredRegistrations = registrations.filter(
    (reg) => reg.status === statusFilter
  );

  const displayRegistrations = 
    statusFilter === "waitlist"
      ? [...filteredRegistrations].sort((a, b) => (a.position || 999) - (b.position || 999))
      : filteredRegistrations;

  const showPositionColumn = statusFilter === "waitlist";

  const fetchData = async () => {
    try {
      setLoading(true);
      const [eventRes, regRes] = await Promise.all([
        GetEventById(eventId),
        GetRegistrations(eventId),
      ]);
      setEvent(eventRes.event);
      setRegistrations(regRes.data || []);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Error loading attendees.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (registrationId, newStatus) => {
    try {
      await UpdateRegistrationStatus(eventId, registrationId, newStatus);
      setRegistrations(
        registrations.map((reg) => {
          if (reg.id === registrationId) {
            return { ...reg, status: newStatus };
          }
          return reg;
        })
      );
    } catch (err) {
      alert(err.response?.data?.message || "Error updating status");
    }
  };

  return (
    <div className="attendee-management-container" style={{ padding: "2rem" }}>
      <div className="attendee-management-header">
        <div>
          <Link to="/organizer/dashboard" className="back-link">
            ← Back to Dashboard
          </Link>
          <h1>Attendee Management</h1>
          {event && <p className="event-subtitle">{event.title}</p>}
        </div>
      </div>

      <div className="status-filters">
        {[
          { key: "confirmed", label: "Confirmed" },
          { key: "pending", label: "Pending" },
          {
            key: "waitlist",
            label: `Waitlist (${registrations.filter((r) => r.status === "waitlist").length})`,
          },
        ].map((filter) => (
          <button
            key={filter.key}
            className={`filter-btn ${statusFilter === filter.key ? "active" : ""}`}
            onClick={() => setStatusFilter(filter.key)}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading-state">Loading attendees...</div>
      ) : error ? (
        <div className="error-state">{error}</div>
      ) : (
        <div className="table-container">
          <table className="attendee-table">
            <thead>
              <tr>
                {showPositionColumn && <th>Position</th>}
                <th>Name</th>
                <th>Email</th>
                <th>Date Registered</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayRegistrations.length === 0 ? (
                <tr>
                  <td colSpan={showPositionColumn ? 6 : 5} className="empty-row">
                    No {statusFilter} registrations found.
                  </td>
                </tr>
              ) : (
                displayRegistrations.map((reg) => {
                  const statusClass = `status-${reg.status}`;
                  const statusLabel = reg.status.charAt(0).toUpperCase() + reg.status.slice(1);

                  return (
                    <tr key={reg.id}>
                      {showPositionColumn && (
                        <td>
                          {reg.position ? (
                            <strong>#{reg.position}</strong>
                          ) : (
                            <span style={{ color: "#cbd5e1" }}>-</span>
                          )}
                        </td>
                      )}
                      
                      <td>{reg.attendee?.name || "Unknown"}</td>
                      <td>{reg.attendee?.email || "N/A"}</td>
                      <td>
                        {new Date(reg.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td>
                        <span className={`status-badge ${statusClass}`}>
                          {statusLabel}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          {reg.status === "pending" && (
                            <>
                              <button
                                className="btn-approve"
                                onClick={() =>
                                  handleUpdateStatus(reg.id, "confirmed")
                                }
                              >
                                Approve
                              </button>
                              <button
                                className="btn-reject"
                                onClick={() =>
                                  handleUpdateStatus(reg.id, "rejected")
                                }
                              >
                                Reject
                              </button>
                            </>
                          )}
                          {reg.status === "waitlist" && (
                            <button
                              className="btn-reject"
                              onClick={() =>
                                handleUpdateStatus(reg.id, "rejected")
                              }
                            >
                              Remove
                            </button>
                          )}
                          {reg.status === "confirmed" && (
                            <span style={{ color: "#cbd5e1" }}>-</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AttendeeManagementPage;