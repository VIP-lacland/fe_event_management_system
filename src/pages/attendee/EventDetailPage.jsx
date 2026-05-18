import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { EventService } from '../../services/EventService';
import './EventDetailPage.css';

const categoryLogos = {
  Music: '/images/logo-music.svg',
  Sports: '/images/logo-sports.svg',
  'Food & Drink': '/images/logo-food-drink.svg',
  Arts: '/images/logo-arts.svg',
  Education: '/images/logo-education.svg',
  Community: '/images/logo-community.svg',
};

const EventDetailPage = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadEvent = async () => {
      setLoading(true);
      setError('');

      try {
        const { data } = await EventService.fetchEventById(eventId);
        setEvent(data);
      } catch (err) {
        setError('Không tìm thấy sự kiện hoặc đã có lỗi xảy ra.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      loadEvent();
    }
  }, [eventId]);

  const ticketType = event?.price ? `Có phí: ${event.price}` : 'Miễn phí';
  const registered = event?.confirmed_count ?? 0;
  const capacity = event?.capacity ?? 0;
  const isFull = capacity > 0 && registered >= capacity;
  const logoSrc = categoryLogos[event?.category] ?? '/images/banner.png';

  return (
    <main className="event-detail-page">
      <div className="detail-breadcrumbs">
        <Link to="/" className="detail-back-link">← Quay lại</Link>
      </div>

      {loading && <div className="detail-empty">Đang tải chi tiết sự kiện...</div>}
      {error && <div className="detail-empty detail-error">{error}</div>}

      {!loading && !error && event && (
        <section className="detail-card">
          <div className="detail-hero" style={{ backgroundImage: `linear-gradient(180deg, rgba(7, 22, 51, 0.18), rgba(7, 22, 51, 0.78)), url('${logoSrc}')` }}>
            <div className="detail-hero-copy">
              <span className="detail-category-pill">{event.category}</span>
              <h1>{event.title}</h1>
              <p>{event.location}</p>
              <div className="detail-hero-meta">
                <span>{new Date(event.event_date).toLocaleDateString('vi-VN', {
                  weekday: 'long',
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })}</span>
                <span>{new Date(event.event_date).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>
          </div>

          <div className="detail-body">
            <div className="detail-panel detail-summary">
              <div className="detail-section">
                <h2>Thông tin chính</h2>
                <p>{event.description || 'Sự kiện này chưa có mô tả chi tiết.'}</p>
              </div>

              <div className="detail-grid">
                <div className="detail-item">
                  <span>Loại sự kiện</span>
                  <strong>{event.category}</strong>
                </div>
                <div className="detail-item">
                  <span>Giá vé</span>
                  <strong>{ticketType}</strong>
                </div>
                <div className="detail-item">
                  <span>Địa điểm</span>
                  <strong>{event.location}</strong>
                </div>
                <div className="detail-item">
                  <span>Số người đăng ký</span>
                  <strong>{registered}/{capacity}</strong>
                </div>
                <div className="detail-item">
                  <span>Trạng thái chỗ</span>
                  <strong>{isFull ? 'Đã đầy' : 'Còn vé'}</strong>
                </div>
              </div>
            </div>

            <aside className="detail-panel detail-actions">
              <div className="detail-ticket-card">
                <div>
                  <span>Trạng thái sự kiện</span>
                  <strong>{event.status === 'published' ? 'Đã công bố' : event.status}</strong>
                </div>
                <div className="detail-price-pill">{ticketType}</div>
              </div>

              <button className="detail-register-btn" type="button" disabled={isFull}>
                {isFull ? 'Hết vé' : 'Đăng ký sự kiện'}
              </button>
            </aside>
          </div>
        </section>
      )}
    </main>
  );
};

export default EventDetailPage;
