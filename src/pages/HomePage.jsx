import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { EventService } from '../services/EventService';
import './HomePage.css';

const categoryData = [
  { key: 'Music', label: 'MUSIC', icon: '🎵' },
  { key: 'Sports', label: 'SPORTS', icon: '🏀' },
  { key: 'Food & Drink', label: 'FOOD & DRINK', icon: '🍽️' },
  { key: 'Arts', label: 'ARTS', icon: '🎭' },
  { key: 'Education', label: 'EDUCATION', icon: '🎓' },
  { key: 'Community', label: 'COMMUNITY', icon: '🌐' },
];

const filters = ['All', 'For you', 'Today', 'This weekend'];

const categoryImages = {
  Music: 'linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)',
  Sports: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)',
  'Food & Drink': 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)',
  Arts: 'linear-gradient(135deg, #facc15 0%, #eab308 100%)',
  Education: 'linear-gradient(135deg, #14b8a6 0%, #0f766e 100%)',
  Community: 'linear-gradient(135deg, #c2410c 0%, #ea580c 100%)',
};

const HomePage = () => {
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true);
      setError('');

      try {
        const eventData = await EventService.fetchEvents();
        setEvents(eventData);
      } catch (err) {
        setError('Không thể tải dữ liệu sự kiện. Vui lòng thử lại sau.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesSearch = searchQuery
        ? [event.title, event.location, event.description]
            .join(' ')
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        : true;

      const matchesCategory =
        selectedCategory === 'All' || event.category === selectedCategory;

      const eventDate = new Date(event.event_date);
      const today = new Date();
      const isToday = eventDate.toDateString() === today.toDateString();
      const isWeekend = [6, 0].includes(eventDate.getDay());

      const matchesFilter =
        selectedFilter === 'All' ||
        (selectedFilter === 'For you' && true) ||
        (selectedFilter === 'Today' && isToday) ||
        (selectedFilter === 'This weekend' && isWeekend);

      return matchesSearch && matchesCategory && matchesFilter;
    });
  }, [events, searchQuery, selectedCategory, selectedFilter]);

  return (
    <main className="homepage">
      <header className="homepage-topbar">
        <div className="homepage-brand">Eventify</div>
        <div className="homepage-nav">
          <button className="homepage-button">Update</button>
          <button className="homepage-button">Find event</button>
          <button className="homepage-button">Create event</button>
          <button className="homepage-button">Help center</button>
          <button className="homepage-button">Find my tickets</button>
          <Link to="/login" className="homepage-action primary">
            Login
          </Link>
        </div>
      </header>

      <section className="homepage-hero">
        <div className="hero-copy">
          <span className="eyebrow">Model: Grace Elizabeth</span>
          <h1>WAITING FOR YOU</h1>
          <p>
            Khám phá sự kiện tại Đà Nẵng và vùng lân cận với hành trình được thiết kế riêng cho bạn.
          </p>
        </div>
        <div className="hero-card">
          <span>Featured Experience</span>
          <strong>Waiting for you</strong>
          <p>
            4 sự kiện nổi bật được cập nhật mỗi ngày. Chọn chủ đề, tìm địa điểm và đặt vé nhanh chóng.
          </p>
          <div className="event-meta">
            <span>Thursday · 18:00</span>
            <span>Flamenco Rooftop, Đà Nẵng</span>
          </div>
        </div>
      </section>

      <section className="category-row">
        {categoryData.map((category) => (
          <div
            key={category.key}
            className="category-card"
            onClick={() => setSelectedCategory(category.key)}
            style={{ cursor: 'pointer' }}
          >
            <div className="category-icon">{category.icon}</div>
            <span>{category.label}</span>
          </div>
        ))}
      </section>

      <section className="homepage-content">
        <div className="browse-header">
          <div className="location-pill">
            <strong>Browsing events in</strong>
            <span>TP. Đà Nẵng</span>
          </div>
          <div className="filter-line">
            {filters.map((filter) => (
              <button
                key={filter}
                type="button"
                className={`filter-chip ${selectedFilter === filter ? 'active' : ''}`}
                onClick={() => setSelectedFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="search-bar">
          <input
            type="search"
            placeholder="Search event..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
          <button type="button">Search</button>
        </div>

        {loading && <p>Đang tải sự kiện...</p>}
        {error && <p>{error}</p>}

        {!loading && !error && filteredEvents.length === 0 && (
          <p>Không tìm thấy sự kiện phù hợp. Vui lòng thử lại với bộ lọc khác.</p>
        )}

        <div className="event-grid">
          {filteredEvents.map((event) => (
            <article className="event-card" key={event.id}>
              <div
                className="event-thumb"
                style={{ background: categoryImages[event.category] || '#8b5cf6' }}
              />
              <div className="event-content">
                <div className="event-meta">
                  <span>{new Date(event.event_date).toLocaleDateString('en-GB', {
                    weekday: 'short',
                    day: '2-digit',
                    month: 'short',
                  })}</span>
                  <span>{event.location}</span>
                </div>
                <h2 className="event-title">{event.title}</h2>
                <p className="event-description">
                  {event.description || 'Sự kiện hấp dẫn đang chờ bạn khám phá.'}
                </p>
                <div className="event-footer">
                  <span className="event-label">{event.category}</span>
                  <button className="event-action">View details</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
};

export default HomePage;
