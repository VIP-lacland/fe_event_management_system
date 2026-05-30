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
  const user = useAuthStore((state) => state.user);
  const [event, setEvent] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewMeta, setReviewMeta] = useState({ total: 0, average_rating: 0 });
  const [reviewLoading, setReviewLoading] = useState(true);
  const [reviewError, setReviewError] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [reviewMessage, setReviewMessage] = useState("");
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

  useEffect(() => {
    const loadReviews = async () => {
      if (!eventId) return;

      setReviewLoading(true);
      setReviewError("");
      try {
        const res = await EventService.getEventReviews(eventId);
        setReviews(res.data || []);
        setReviewMeta(res.meta || { total: 0, average_rating: 0 });
      } catch (err) {
        console.error(err);
        setReviewError("Could not load reviews for this event.");
      } finally {
        setReviewLoading(false);
      }
    };

    loadReviews();
  }, [eventId]);

  const handleRegisterClick = () => {
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      navigate(`/attendee/event/${eventId}/register`);
    }
  };

  const ticketType =
    event?.price > 0 ? `$${parseFloat(event.price).toFixed(2)}` : "Free";
  const registered = event?.confirmed_count ?? 0;
  const capacity = event?.capacity ?? 0;
  const isFull = capacity > 0 && registered >= capacity;
  const waitlistCount = event?.waitlist_count ?? 0;
  const logoSrc = categoryLogos[event?.category] ?? "/images/banner.png";
  const isEventEnded = event ? new Date(event.event_date) <= new Date() : false;
  const hasReviewed = reviews.some((r) => r.attendee_id === user?.id);

  const canLeaveReview =
    isAuthenticated &&
    user?.role === "attendee" &&
    isEventEnded &&
    !hasReviewed;

  const handleReviewInputChange = (field, value) => {
    setReviewForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setReviewMessage("");

    if (!reviewForm.comment.trim()) {
      setReviewMessage("Please enter your experience before submitting.");
      return;
    }

    setSubmittingReview(true);
    try {
      const payload = {
        rating: Number(reviewForm.rating),
        comment: reviewForm.comment.trim(),
      };
      const created = await EventService.createEventReview(eventId, payload);
      setReviews((prev) => [created.data, ...prev]);
      setReviewMeta((prev) => {
        const nextTotal = (prev.total || 0) + 1;
        const currentTotalScore = (prev.average_rating || 0) * (prev.total || 0);
        const nextAverage = Number(
          ((currentTotalScore + payload.rating) / nextTotal).toFixed(1),
        );
        return { ...prev, total: nextTotal, average_rating: nextAverage };
      });
      setReviewForm({ rating: 5, comment: "" });
      setReviewMessage("Review submitted successfully.");
    } catch (err) {
      console.error(err);
      setReviewMessage(
        err.response?.data?.message || "Could not submit review. Please try again.",
      );
    } finally {
      setSubmittingReview(false);
    }
  };

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

          <section className="detail-panel detail-reviews">
            <div className="detail-reviews-header">
              <h2>Reviews</h2>
              <p>
                {reviewMeta.total || 0} review(s) — Average:{" "}
                {reviewMeta.average_rating || 0}/5
              </p>
            </div>

            {canLeaveReview && (
              <form className="review-form" onSubmit={handleSubmitReview}>
                <h3>Share your experience</h3>
                <label htmlFor="rating">Rating</label>
                <select
                  id="rating"
                  value={reviewForm.rating}
                  onChange={(e) =>
                    handleReviewInputChange("rating", Number(e.target.value))
                  }
                  disabled={submittingReview}
                >
                  <option value={5}>5 — Excellent</option>
                  <option value={4}>4 — Good</option>
                  <option value={3}>3 — Average</option>
                  <option value={2}>2 — Poor</option>
                  <option value={1}>1 — Bad</option>
                </select>

                <label htmlFor="comment">Comment</label>
                <textarea
                  id="comment"
                  maxLength={300}
                  value={reviewForm.comment}
                  onChange={(e) =>
                    handleReviewInputChange("comment", e.target.value)
                  }
                  disabled={submittingReview}
                  placeholder="Write your review..."
                />

                <button type="submit" disabled={submittingReview}>
                  {submittingReview ? "Submitting..." : "Submit Review"}
                </button>
                {reviewMessage && (
                  <p className="review-message">{reviewMessage}</p>
                )}
              </form>
            )}

            {!isEventEnded && (
              <p className="review-note">Reviews open after the event ends.</p>
            )}

            {reviewLoading ? (
              <p className="review-note">Loading reviews...</p>
            ) : reviewError ? (
              <p className="review-note review-error">{reviewError}</p>
            ) : reviews.length === 0 ? (
              <p className="review-note">
                No reviews yet. Be the first one after attending this event.
              </p>
            ) : (
              <div className="review-list">
                {reviews.map((review) => (
                  <article key={review.id} className="review-item">
                    <div className="review-item-head">
                      <strong>{review.attendee?.name || "Attendee"}</strong>
                      <span>
                        {"★".repeat(review.rating)}
                        {"☆".repeat(5 - review.rating)}
                      </span>
                    </div>
                    <p>{review.comment}</p>
                  </article>
                ))}
              </div>
            )}
          </section>
        </section>
      )}
    </main>
  );
};

export default EventDetailPage;
