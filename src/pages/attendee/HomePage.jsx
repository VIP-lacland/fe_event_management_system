import { useEffect, useMemo, useState } from 'react';
import { EventService } from '../../services/EventService';
import Header from '../../components/layouts/Header';
import HomeContent from '../../components/layouts/HomeContent';
import Footer from '../../components/layouts/Footer';
import './HomePage.css';

const categoryData = [
  { key: 'All', label: 'ALL', image: '/images/banner.png' },
  { key: 'Music', label: 'MUSIC', image: '/images/music.png' },
  { key: 'Sports', label: 'SPORTS', image: '/images/sports.png' },
  { key: 'Food & Drink', label: 'FOOD & DRINK', image: '/images/food-drink.png' },
  { key: 'Arts', label: 'ARTS', image: '/images/arts.png' },
  { key: 'Education', label: 'EDUCATION', image: '/images/education.png' },
  { key: 'Community', label: 'COMMUNITY', image: '/images/community.png' },
];

const categoryImages = {
  Music: "linear-gradient(135deg, rgba(124, 58, 237, 0.12), rgba(236, 72, 153, 0.36)), url('/images/music.png')",
  Sports: "linear-gradient(135deg, rgba(14, 165, 233, 0.16), rgba(6, 182, 212, 0.34)), url('/images/sports.png')",
  'Food & Drink': "linear-gradient(135deg, rgba(249, 115, 22, 0.16), rgba(251, 146, 60, 0.34)), url('/images/food-drink.png')",
  Arts: "linear-gradient(135deg, rgba(250, 204, 21, 0.16), rgba(234, 179, 8, 0.34)), url('/images/arts.png')",
  Education: "linear-gradient(135deg, rgba(20, 184, 166, 0.16), rgba(15, 118, 110, 0.34)), url('/images/education.png')",
  Community: "linear-gradient(135deg, rgba(194, 65, 12, 0.16), rgba(234, 88, 12, 0.34)), url('/images/community.png')",
};

const EVENTS_PER_PAGE = 6;

const normalizeCity = (city) =>
  city
    .toLowerCase()
    .replace(/tp\.?\s*|thành phố\s*/gi, '')
    .replace(/[–—]/g, '-')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .trim();

const HomePage = () => {
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [selectedCity, setSelectedCity] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true);
      setError('');

      try {
        const { data } = await EventService.fetchEvents();
        setEvents(data || []);
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
    const normalizedCity = normalizeCity(selectedCity);

    return events.filter((event) => {
      const eventText = [event.title, event.location, event.description]
        .join(' ')
        .toLowerCase();

      const matchesSearch = searchQuery
        ? eventText.includes(searchQuery.toLowerCase())
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

      const matchesCity = normalizedCity
        ? event.location.toLowerCase().includes(normalizedCity)
        : true;

      return matchesSearch && matchesCategory && matchesFilter && matchesCity;
    });
  }, [events, searchQuery, selectedCategory, selectedFilter, selectedCity]);

  const totalPages = Math.max(1, Math.ceil(filteredEvents.length / EVENTS_PER_PAGE));
  const visiblePage = Math.min(currentPage, totalPages);

  const paginatedEvents = useMemo(() => {
    const startIndex = (visiblePage - 1) * EVENTS_PER_PAGE;
    return filteredEvents.slice(startIndex, startIndex + EVENTS_PER_PAGE);
  }, [filteredEvents, visiblePage]);

  const resetPage = (callback) => (value) => {
    callback(value);
    setCurrentPage(1);
  };

  return (
    <main className="homepage">
      <Header />

      <section className="homepage-hero">
        <img
          className="hero-banner-image"
          src="/images/banner.png"
          alt="A Night for Every Star - Year End Party 2025"
        />
        <div className="hero-shade" />
        <div className="hero-info">
          <span className="hero-kicker">Featured Event</span>
          <h1>A Night for Every Star</h1>
          <p>
            Đêm Year End Party 2026 tại Đà Nẵng với âm nhạc, ánh sáng và không gian kết nối dành cho cộng đồng.
          </p>
          <div className="hero-actions">
            <a href="#events" className="hero-primary-action">View Events</a>
            <div className="hero-meta">
              <span>23.01.2026</span>
              <span>Đà Nẵng Convention Center</span>
            </div>
          </div>
        </div>
      </section>

      <section className="category-row">
        {categoryData.map((category) => (
          <button
            key={category.key}
            type="button"
            className={`category-card ${selectedCategory === category.key ? 'active' : ''}`}
            onClick={() => {
              setSelectedCategory(category.key);
              setCurrentPage(1);
            }}
          >
            <div className="category-icon">
              <img src={category.image} alt={`${category.label} icon`} />
            </div>
            <span>{category.label}</span>
          </button>
        ))}
      </section>

      <HomeContent
        selectedCity={selectedCity}
        selectedFilter={selectedFilter}
        onCityChange={resetPage(setSelectedCity)}
        onFilterChange={resetPage(setSelectedFilter)}
        searchQuery={searchQuery}
        onSearchChange={resetPage(setSearchQuery)}
        filteredEvents={filteredEvents}
        paginatedEvents={paginatedEvents}
        loading={loading}
        error={error}
        categoryImages={categoryImages}
        currentPage={visiblePage}
        totalPages={totalPages}
        eventsPerPage={EVENTS_PER_PAGE}
        onPageChange={setCurrentPage}
      />

      <Footer />
    </main>
  );
};

export default HomePage;
