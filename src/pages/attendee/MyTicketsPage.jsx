import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { GetMyTickets, CancelTicket } from "../../services/EventService";
import Header from "../../components/layouts/Header/AttendeeHeader";
import Footer from "../../components/layouts/Footer/AttendeeFooter";
import "./MyTicketsPage.css";

const MyTicketsPage = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const res = await GetMyTickets();
      setTickets(res.data || []);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Error loading tickets. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelTicket = async (eventId) => {
    if (
      !window.confirm(
        "Are you sure you want to cancel your registration for this event?",
      )
    ) {
      return;
    }

    try {
      await CancelTicket(eventId);
      setTickets(
        tickets.map((ticket) => {
          if (ticket.event_id === eventId) {
            return { ...ticket, status: "cancelled" };
          }
          return ticket;
        }),
      );
      alert("Ticket cancelled successfully!");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error cancelling ticket.");
    }
  };

  const formatDate = (dateString) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const getStatusDisplay = (status, position) => {
    const base = {
      confirmed: {
        label: "Confirmed",
        class: "badge-confirmed",
        icon: "✅",
        canCancel: true,
      },
      pending: {
        label: "Pending Approval",
        class: "badge-pending",
        icon: "⏳",
        canCancel: true,
      },
      waitlist: {
        label: `On Waitlist #${position || "?"}`,
        class: "badge-waitlist",
        icon: "🕐",
        canCancel: true,
      },
      cancelled: {
        label: "Cancelled",
        class: "badge-cancelled",
        icon: "❌",
        canCancel: false,
      },
    };
    return (
      base[status] || {
        label: status,
        class: `badge-${status}`,
        icon: "•",
        canCancel: true,
      }
    );
  };

  // const statusInfo = getStatusDisplay(ticket.status, ticket.position);

  return (
    <div className="my-tickets-page">
      <Header />

      <main className="tickets-main">
        <div className="tickets-container">
          <h1 className="tickets-title">My Tickets</h1>

          {loading ? (
            <div className="tickets-loading">Loading your tickets...</div>
          ) : error ? (
            <div className="tickets-error">{error}</div>
          ) : tickets.length === 0 ? (
            <div className="tickets-empty">
              <p>You haven't registered for any events yet.</p>
              <Link to="/" className="tickets-btn-primary">
                Discover Events
              </Link>
            </div>
          ) : (
            <div className="tickets-list">
              {tickets.map((ticket) => {
                const event = ticket.event;
                if (!event) return null;

                const statusInfo = getStatusDisplay(ticket.status, ticket.position);

                return (
                  <div
                    key={ticket.id}
                    className={`ticket-card ${ticket.status === "cancelled" ? "cancelled" : ""}`}
                  >
                    <div className="ticket-card-content">
                      <div className="ticket-header">
                        <span className={`ticket-status ${statusInfo.class}`}>
                          {statusInfo.icon} {statusInfo.label}
                        </span>
                        {/* Hiển thị thêm estimated time nếu waitlist */}
                        {ticket.status === "waitlist" && (
                          <small className="waitlist-eta">
                            Estimated wait: {ticket.position * 2 - 5} hours*
                          </small>
                        )}
                      </div>

                      <h2 className="ticket-event-title">{event.title}</h2>

                      <div className="ticket-details">
                        <div className="detail-item">
                          <span className="detail-icon">📅</span>
                          <span>{formatDate(event.event_date)}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-icon">📍</span>
                          <span>{event.location}</span>
                        </div>
                      </div>

                      <div className="ticket-actions">
                        <Link
                          to={`/event/${event.id}`}
                          className="ticket-btn-view"
                        >
                          View Event
                        </Link>
                        {statusInfo.canCancel && (
                          <button
                            onClick={() => handleCancelTicket(event.id)}
                            className="ticket-btn-cancel"
                          >
                            {ticket.status === "waitlist"
                              ? "Leave Waitlist"
                              : "Cancel Registration"}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MyTicketsPage;
