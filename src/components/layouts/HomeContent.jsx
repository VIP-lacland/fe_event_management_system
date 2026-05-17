import CityDropdown from '../ui/CityDropdown';
import SearchBar from '../ui/SearchBar';

const filters = ['All', 'For you', 'Today', 'This weekend'];

const HomeContent = ({
  selectedCity,
  selectedFilter,
  onCityChange,
  onFilterChange,
  searchQuery,
  onSearchChange,
  filteredEvents,
  loading,
  error,
  categoryImages,
}) => {
  return (
    <section className="homepage-content" id="events">
      <div className="browse-controls">
        <CityDropdown selectedCity={selectedCity} onCityChange={onCityChange} />
        <div className="filter-line">
          {filters.map((filter) => (
            <button
              key={filter}
              type="button"
              className={`filter-chip ${selectedFilter === filter ? 'active' : ''}`}
              onClick={() => onFilterChange(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <SearchBar searchQuery={searchQuery} onSearchChange={onSearchChange} />

      {loading && <p>Đang tải sự kiện...</p>}
      {error && <p>{error}</p>}
      {!loading && !error && filteredEvents.length === 0 && (
        <p>Không tìm thấy sự kiện phù hợp. Vui lòng thử lại với bộ lọc khác.</p>
      )}

      <div className="event-grid">
        {filteredEvents.map((event) => {
          const thumbStyle = { backgroundImage: "url('/images/banner.png')", backgroundSize: 'cover', backgroundPosition: 'center' };

          return (
            <article className="event-card" key={event.id}>
              <div className="event-thumb" style={thumbStyle} />
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
                  <button className="event-action" type="button">
                    View details
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default HomeContent;
