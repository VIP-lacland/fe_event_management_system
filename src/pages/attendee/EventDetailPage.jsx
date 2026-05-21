import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { EventService } from "../../services/EventService";
import { useAuthStore } from "../../store/authStore";
import "./EventDetailPage.css";

const categoryLogos = {
  Music: "/images/logo-music.svg",
  Sports: "/images/logo-sports.svg",
  "Food & Drink": "/images/logo-food-drink.svg",
  Arts: "/images/logo-arts.svg",
  Education: "/images/logo-education.svg",
  Community: "/images/logo-community.svg",
};

const EventDetailPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadEvent = async () => {
      setLoading(true);
      setError("");

      try {
        const { data } = await EventService.fetchEventById(eventId);
        setEvent(data);
      } catch (err) {
        setError("Không tìm thấy sự kiện hoặc đã có lỗi xảy ra.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      loadEvent();
    }
  }, [eventId]);

  const handleRegisterClick = () => {
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      navigate(`/event/${eventId}/register`);
    }
  };

  const ticketType =
    event?.price > 0 ? `$${parseFloat(event.price).toFixed(2)}` : "Free";
  const registered = event?.confirmed_count ?? 0;
  const capacity = event?.capacity ?? 0;
  const isFull = capacity > 0 && registered >= capacity;
  const waitlistCount = event?.waitlist_count ?? 0;
  const logoSrc = categoryLogos[event?.category] ?? "/images/banner.png";

  return (
    <main className="event-detail-page">
      <div className="detail-breadcrumbs">
        <Link to="/" className="detail-back-link">
          ← Back
        </Link>
      </div>

      {loading && <div className="detail-empty">Loading event details...</div>}
      {error && <div className="detail-empty detail-error">{error}</div>}

      {!loading && !error && event && (
        <section className="detail-card">
          <div
            className="detail-hero"
            style={{
              backgroundImage: `linear-gradient(180deg, rgba(7, 22, 51, 0.18), rgba(7, 22, 51, 0.78)), url('${logoSrc}')`,
            }}
          >
            <div className="detail-hero-copy">
              <span className="detail-category-pill">{event.category}</span>
              <h1>{event.title}</h1>
              <p>{event.location}</p>
              <div className="detail-hero-meta">
                <span>
                  {new Date(event.event_date).toLocaleDateString("en-US", {
                    weekday: "long",
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
                <span>
                  {new Date(event.event_date).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          </div>

          <div className="detail-body">
            <div className="detail-panel detail-summary">
              <div className="detail-section">
                <h2>Event Information</h2>
                <p>
                  {event.description ||
                    "No detailed description provided for this event."}
                </p>
              </div>

              <div className="detail-grid">
                <div className="detail-item">
                  <span>Category</span>
                  <strong>{event.category}</strong>
                </div>
                <div className="detail-item">
                  <span>Ticket Price</span>
                  <strong>{ticketType}</strong>
                </div>
                <div className="detail-item">
                  <span>Location</span>
                  <strong>{event.location}</strong>
                </div>
                <div className="detail-item">
                  <span>Registered</span>
                  <strong>
                    {registered}/{capacity}
                  </strong>
                </div>
                <div className="detail-item">
                  <span>Availability</span>
                  <strong>{isFull ? "Sold Out" : "Available"}</strong>
                </div>
              </div>
            </div>

            <aside className="detail-panel detail-actions">
              <div className="detail-ticket-card">
                <div>
                  <span>Status</span>
                  <strong>
                    {event.status === "published" ? "Published" : event.status}
                  </strong>
                </div>
                <div className="detail-price-pill">{ticketType}</div>
                {isFull && waitlistCount > 0 && (
                  <small className="waitlist-count">
                    {waitlistCount} people on waitlist
                  </small>
                )}
              </div>

              <button
                className={`detail-register-btn ${isFull ? "waitlist-btn" : ""}`}
                type="button"
                onClick={handleRegisterClick}
                // Không disable khi full, vẫn cho join waitlist
              >
                {isFull ? "Join Waitlist" : "Register Now"}
              </button>
              {isFull && (
                <p className="detail-notice">
                  Event is full. Join waitlist to be notified if a spot opens.
                </p>
              )}
            </aside>
          </div>
        </section>
      )}
    </main>
  );
};

export default EventDetailPage;
