import { useEffect, useMemo, useState } from 'react';
import { EventService } from '../../services/EventService';
import Header from '../../components/layouts/Header';
import HomeContent from '../../components/layouts/HomeContent';
import Footer from '../../components/layouts/Footer';
import './HomePage.css';

const categoryData = [
  { key: 'Music', label: 'MUSIC', image: '/images/music.png' },
  { key: 'Sports', label: 'SPORTS', image: '/images/sports.png' },
  { key: 'Food & Drink', label: 'FOOD & DRINK', image: '/images/food-drink.png' },
  { key: 'Arts', label: 'ARTS', image: '/images/arts.png' },
  { key: 'Education', label: 'EDUCATION', image: '/images/education.png' },
  { key: 'Community', label: 'COMMUNITY', image: '/images/community.png' },
];

const categoryImages = {
  Music: 'linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)',
  Sports: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)',
  'Food & Drink': 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)',
  Arts: 'linear-gradient(135deg, #facc15 0%, #eab308 100%)',
  Education: 'linear-gradient(135deg, #14b8a6 0%, #0f766e 100%)',
  Community: 'linear-gradient(135deg, #c2410c 0%, #ea580c 100%)',
};

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
            Đêm Year End Party 2025 tại Đà Nẵng với âm nhạc, ánh sáng và không gian kết nối dành cho cộng đồng.
          </p>
          <div className="hero-actions">
            <a href="#events" className="hero-primary-action">Xem sự kiện</a>
            <div className="hero-meta">
              <span>23.01.2026</span>
              <span>Đà Nẵng Convention Center</span>
            </div>
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
            <div className="category-icon">
              <img src={category.image} alt={`${category.label} icon`} />
            </div>
            <span>{category.label}</span>
          </div>
        ))}
      </section>

      <HomeContent
        selectedCity={selectedCity}
        selectedFilter={selectedFilter}
        onCityChange={setSelectedCity}
        onFilterChange={setSelectedFilter}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filteredEvents={filteredEvents}
        loading={loading}
        error={error}
        categoryImages={categoryImages}
      />

      <Footer />
    </main>
  );
};

export default HomePage;
