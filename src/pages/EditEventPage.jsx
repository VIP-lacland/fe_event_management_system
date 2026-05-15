// src/pages/EditEventPage.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEventStore } from '../store/eventStore';
import '../styles/EditEvent.css';

const CATEGORIES = ['Music', 'Sports', 'Food & Drink', 'Arts', 'Education', 'Community'];
const STATUSES = ['draft', 'published', 'cancelled'];

export function EditEventPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { event, fetchEventById, updateEvent, isLoading, error } = useEventStore();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Music',
    location: '',
    event_date: '',
    capacity: 1,
    status: 'draft',
  });

  const [formError, setFormError] = useState('');
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Load event on mount
  useEffect(() => {
    if (eventId) {
      fetchEventById(eventId)
        .then((data) => {
          setFormData({
            title: data.title || '',
            description: data.description || '',
            category: data.category || 'Music',
            location: data.location || '',
            event_date: data.event_date ? data.event_date.split('T')[0] : '',
            capacity: data.capacity || 1,
            status: data.status || 'draft',
          });
        })
        .catch(() => setFormError('Failed to load event'));
    }
  }, [eventId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'capacity' ? parseInt(value) || 1 : value,
    }));
  };

  const handleStatusChange = (newStatus) => {
    setFormData((prev) => ({ ...prev, status: newStatus }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSuccess(false);
    setSubmitting(true);

    try {
      // Validation
      if (!formData.title.trim()) throw new Error('Title is required');
      if (!formData.location.trim()) throw new Error('Location is required');
      if (!formData.event_date) throw new Error('Event date is required');
      if (formData.capacity < 1) throw new Error('Capacity must be at least 1');

      await updateEvent(eventId, formData);
      setSuccess(true);
      setTimeout(() => navigate('/events'), 2000);
    } catch (err) {
      setFormError(err.message || 'Update failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="edit-event-container">
      <div className="edit-event-box">
        <h1>Edit Event</h1>

        {isLoading && <div className="loading">Loading event...</div>}

        {error && <div className="error-banner">{error}</div>}

        {!isLoading && (
          <form onSubmit={handleSubmit} className="edit-form">
            {/* Status Toggle */}
            <div className="form-group">
              <label>Status</label>
              <div className="status-toggle">
                {STATUSES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    className={`status-btn ${formData.status === s ? 'active' : ''}`}
                    onClick={() => handleStatusChange(s)}
                    disabled={submitting}
                  >
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div className="form-group">
              <label htmlFor="title">Title *</label>
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                placeholder="Event title"
                disabled={submitting}
                required
              />
            </div>

            {/* Description */}
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Event description"
                disabled={submitting}
                rows="4"
              />
            </div>

            {/* Category */}
            <div className="form-group">
              <label htmlFor="category">Category *</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                disabled={submitting}
                required
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div className="form-group">
              <label htmlFor="location">Location *</label>
              <input
                id="location"
                name="location"
                type="text"
                value={formData.location}
                onChange={handleChange}
                placeholder="Event location"
                disabled={submitting}
                required
              />
            </div>

            {/* Date and Capacity */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="event_date">Date *</label>
                <input
                  id="event_date"
                  name="event_date"
                  type="date"
                  value={formData.event_date}
                  onChange={handleChange}
                  disabled={submitting}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="capacity">Capacity *</label>
                <input
                  id="capacity"
                  name="capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={handleChange}
                  disabled={submitting}
                  min="1"
                  required
                />
              </div>
            </div>

            {/* Messages */}
            {formError && <div className="error-message">{formError}</div>}
            {success && <div className="success-message">Event updated! Redirecting...</div>}

            {/* Actions */}
            <div className="form-actions">
              <button
                type="button"
                className="btn-cancel"
                onClick={() => navigate('/events')}
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-submit"
                disabled={submitting || isLoading}
              >
                {submitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
