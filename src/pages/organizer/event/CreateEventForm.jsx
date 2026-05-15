import { useState } from "react";
import { CreateEvent } from "../../../services/EventService";
import "./CreateEventForm.css";

const CATEGORIES = ["Music", "Sports", "Food & Drink", "Arts", "Education", "Community"];

const initialForm = {
  title: "",
  description: "",
  category: "",
  location: "",
  event_date: "",
  capacity: "",
};

export default function CreateEventForm() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = "Title is required.";
    if (!form.category) errs.category = "Please select a category.";
    if (!form.location.trim()) errs.location = "Location is required.";
    if (!form.event_date) errs.event_date = "Please select an event date.";
    if (!form.capacity || Number(form.capacity) < 1)
      errs.capacity = "Capacity must be a positive number.";
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setSuccessMsg("");
    setErrorMsg("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const payload = { 
        ...form, 
        capacity: Number(form.capacity),
        status: "draft"
      };
      await CreateEvent(payload);
      setSuccessMsg("Event saved successfully!");
      setForm(initialForm);
    } catch (err) {
      setErrorMsg(
        err?.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm(initialForm);
    setErrors({});
    setSuccessMsg("");
    setErrorMsg("");
  };

  const getInputClass = (field) => errors[field] ? "event-form-input-error" : "";
  const getSelectClass = (field) => errors[field] ? "event-form-select-error" : "";

  return (
    <div className="event-form-wrapper">
      <div className="event-form-container">

        {/* Card */}
        <div className="event-form-card">
          <div className="event-form-accent-bar" />

          <form onSubmit={handleSubmit} noValidate className="event-form-body">
            {/* Messages */}
            {successMsg && (
              <div className="event-form-message event-form-message-success">
                <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {successMsg}
              </div>
            )}
            {errorMsg && (
              <div className="event-form-message event-form-message-error">
                <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {errorMsg}
              </div>
            )}

            <div className="event-form-header">
                <div className="event-form-icon-box">
                    <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </div>
                <h1 className="event-form-title">Create New Event</h1>
                <p className="event-form-subtitle">Fill in all the information to create and manage your event</p>
                </div>

            {/* Title */}
            <div className="event-form-field">
              <label className="event-form-label event-form-label-required">Event Title</label>
              <input type="text" name="title" value={form.title} onChange={handleChange} placeholder="Example: Summer Music Festival 2025" className={`event-form-input ${getInputClass("title")}`} />
              {errors.title && <p className="event-form-error-text">{errors.title}</p>}
            </div>

            {/* Description */}
            <div className="event-form-field">
              <label className="event-form-label">Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows={4} placeholder="Short description about the event content and program..." className="event-form-textarea" />
            </div>

            {/* Category */}
            <div className="event-form-field">
              <label className="event-form-label event-form-label-required">Category</label>
              <select name="category" value={form.category} onChange={handleChange} className={`event-form-select ${getSelectClass("category")}`}>
                <option value="">-- Select Category --</option>
                {CATEGORIES.map((cat) => (<option key={cat} value={cat}>{cat}</option>))}
              </select>
              {errors.category && <p className="event-form-error-text">{errors.category}</p>}
            </div>

            {/* Location */}
            <div className="event-form-field">
              <label className="event-form-label event-form-label-required">Location</label>
              <div className="event-form-input-wrapper">
                <span className="event-form-input-icon">
                  <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </span>
                <input type="text" name="location" value={form.location} onChange={handleChange} placeholder="Example: Hanoi National Convention Center" className={`event-form-input event-form-input-with-icon ${getInputClass("location")}`} />
              </div>
              {errors.location && <p className="event-form-error-text">{errors.location}</p>}
            </div>

            {/* Date & Capacity */}
            <div className="event-form-grid">
              <div className="event-form-field">
                <label className="event-form-label event-form-label-required">Event Date & Time</label>
                <input type="datetime-local" name="event_date" value={form.event_date} onChange={handleChange} className={`event-form-input ${getInputClass("event_date")}`} />
                {errors.event_date && <p className="event-form-error-text">{errors.event_date}</p>}
              </div>

              <div className="event-form-field">
                <label className="event-form-label event-form-label-required">Capacity (people)</label>
                <div className="event-form-input-wrapper">
                  <span className="event-form-input-icon">
                    <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0" />
                    </svg>
                  </span>
                  <input type="number" name="capacity" value={form.capacity} onChange={handleChange} placeholder="Example: 500" min={1} className={`event-form-input event-form-input-with-icon ${getInputClass("capacity")}`} />
                </div>
                {errors.capacity && <p className="event-form-error-text">{errors.capacity}</p>}
              </div>
            </div>

            {/* Divider */}
            <div className="event-form-divider" />

            {/* Reset & Save Buttons */}
            <div className="event-form-actions">
              <button type="button" onClick={handleReset} className="event-form-btn event-form-btn-secondary">
                Reset
              </button>

              <button type="submit" disabled={loading} className="event-form-btn event-form-btn-primary">
                {loading ? (
                  <>
                    <svg className="animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Save
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        <p className="event-form-footer">
          Fields with asterisk <span className="required-mark">*</span> are required
        </p>
      </div>
    </div>
  );
}