// src/pages/organizer/event/EditEventPage.jsx
import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEventStore } from '../../../store/eventStore';
import './EditEvent.css';

const CATEGORIES = ['Music', 'Sports', 'Food & Drink', 'Arts', 'Education', 'Community'];

const STATUS_LABELS = {
  draft: 'Bản nháp',
  published: 'Đã đăng',
  cancelled: 'Đã huỷ',
};

/**
 * Quy tắc chuyển trạng thái:
 * - draft     → published, cancelled
 * - published → cancelled  (KHÔNG quay lại draft)
 * - cancelled → (không chuyển được)
 */
function getAllowedStatuses(currentStatus) {
  switch (currentStatus) {
    case 'draft':
      return ['draft', 'published', 'cancelled'];
    case 'published':
      return ['published', 'cancelled'];
    case 'cancelled':
      return ['cancelled'];
    default:
      return ['draft'];
  }
}

export default function EditEventPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { fetchEventById, updateEvent, isLoading, error } = useEventStore();

  // Trạng thái gốc lấy từ DB (để xác định quyền chỉnh sửa)
  const [originalStatus, setOriginalStatus] = useState('draft');

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

  // published / cancelled → chỉ xem, không sửa
  const isReadOnly = originalStatus === 'published' || originalStatus === 'cancelled';

  // Danh sách trạng thái được phép chuyển
  const allowedStatuses = useMemo(
    () => getAllowedStatuses(originalStatus),
    [originalStatus]
  );

  // Load dữ liệu sự kiện
  useEffect(() => {
    if (eventId) {
      fetchEventById(eventId)
        .then((data) => {
          const status = data.status || 'draft';
          setOriginalStatus(status);
          setFormData({
            title: data.title || '',
            description: data.description || '',
            category: data.category || 'Music',
            location: data.location || '',
            event_date: data.event_date ? data.event_date.split('T')[0] : '',
            capacity: data.capacity || 1,
            status,
          });
        })
        .catch(() => setFormError('Không thể tải thông tin sự kiện'));
    }
  }, [eventId, fetchEventById]);

  const handleChange = (e) => {
    if (isReadOnly) return;
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'capacity' ? parseInt(value) || 1 : value,
    }));
  };

  const handleStatusChange = (newStatus) => {
    if (!allowedStatuses.includes(newStatus)) return;
    // Nếu đang published/cancelled → chỉ cho chuyển cancelled (nếu published)
    setFormData((prev) => ({ ...prev, status: newStatus }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isReadOnly) return;

    setFormError('');
    setSuccess(false);
    setSubmitting(true);

    try {
      if (!formData.title.trim()) throw new Error('Tiêu đề không được để trống');
      if (!formData.location.trim()) throw new Error('Địa điểm không được để trống');
      if (!formData.event_date) throw new Error('Vui lòng chọn ngày diễn ra');
      if (formData.capacity < 1) throw new Error('Sức chứa phải lớn hơn 0');

      await updateEvent(eventId, formData);
      setSuccess(true);
      setTimeout(() => navigate('/organizer/events'), 1500);
    } catch (err) {
      setFormError(err.message || 'Cập nhật thất bại');
    } finally {
      setSubmitting(false);
    }
  };

  // Tiêu đề trang
  const pageTitle = isReadOnly ? 'Event Details' : 'Edit Event';

  return (
    <div className="edit-event-container">
      <div className="edit-event-box">
        <h1>{pageTitle}</h1>

        {/* Banner chỉ xem */}
        {isReadOnly && (
          <div className="readonly-banner">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            Sự kiện ở trạng thái <strong>{STATUS_LABELS[originalStatus]}</strong> — chỉ xem, không thể chỉnh sửa.
          </div>
        )}

        {isLoading && <div className="loading">Đang tải dữ liệu...</div>}
        {error && <div className="error-banner">{error}</div>}

        {!isLoading && (
          <form onSubmit={handleSubmit} className="edit-form">

            {/* Trạng thái */}
            <div className="form-group">
              <label>Trạng thái</label>
              <div className="status-toggle">
                {Object.entries(STATUS_LABELS).map(([key, label]) => {
                  const isAllowed = allowedStatuses.includes(key);
                  const isActive = formData.status === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      className={`status-btn status-btn--${key} ${isActive ? 'active' : ''}`}
                      onClick={() => handleStatusChange(key)}
                      disabled={!isAllowed || submitting}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tiêu đề */}
            <div className="form-group">
              <label htmlFor="title">Tiêu đề sự kiện *</label>
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                placeholder="VD: Festival Âm nhạc Mùa hè 2026"
                disabled={submitting || isReadOnly}
                required
              />
            </div>

            {/* Mô tả */}
            <div className="form-group">
              <label htmlFor="description">Mô tả</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Mô tả ngắn về nội dung sự kiện..."
                disabled={submitting || isReadOnly}
                rows="4"
              />
            </div>

            {/* Danh mục */}
            <div className="form-group">
              <label htmlFor="category">Danh mục *</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                disabled={submitting || isReadOnly}
                required
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Địa điểm */}
            <div className="form-group">
              <label htmlFor="location">Địa điểm *</label>
              <input
                id="location"
                name="location"
                type="text"
                value={formData.location}
                onChange={handleChange}
                placeholder="VD: Trung tâm Hội nghị Quốc gia"
                disabled={submitting || isReadOnly}
                required
              />
            </div>

            {/* Ngày & Sức chứa */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="event_date">Ngày diễn ra *</label>
                <input
                  id="event_date"
                  name="event_date"
                  type="date"
                  value={formData.event_date}
                  onChange={handleChange}
                  disabled={submitting || isReadOnly}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="capacity">Sức chứa (người) *</label>
                <input
                  id="capacity"
                  name="capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={handleChange}
                  disabled={submitting || isReadOnly}
                  min="1"
                  required
                />
              </div>
            </div>

            {/* Thông báo */}
            {formError && <div className="error-message">{formError}</div>}
            {success && <div className="success-message">Cập nhật thành công! Đang chuyển hướng...</div>}

            {/* Nút hành động */}
            <div className="form-actions">
              <button
                type="button"
                className="btn-cancel"
                onClick={() => navigate('/organizer/events')}
                disabled={submitting}
              >
                {isReadOnly ? 'Quay lại' : 'Huỷ bỏ'}
              </button>

              {!isReadOnly && (
                <button
                  type="submit"
                  className="btn-submit"
                  disabled={submitting || isLoading}
                >
                  {submitting ? 'Đang lưu...' : 'Lưu thay đổi'}
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
