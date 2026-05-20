import CityDropdown from '../ui/CityDropdown';
import SearchBar from '../ui/SearchBar';
import { useNavigate } from 'react-router-dom';

const filters = ['All', 'For you', 'Today', 'This weekend'];

const HomeContent = ({
  selectedCity,
  selectedFilter,
  onCityChange,
  onFilterChange,
  searchQuery,
  onSearchChange,
  filteredEvents,
  paginatedEvents,
  loading,
  error,
  categoryImages,
  currentPage,
  totalPages,
  eventsPerPage,
  onPageChange,
}) => {
  const navigate = useNavigate();
  const firstEventNumber = filteredEvents.length === 0
    ? 0
    : (currentPage - 1) * eventsPerPage + 1;
  const lastEventNumber = Math.min(currentPage * eventsPerPage, filteredEvents.length);
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

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
        {paginatedEvents.map((event) => {
          const thumbStyle = {
            backgroundImage: categoryImages?.[event.category] || "url('/images/banner.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          };

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
                <div className="event-capacity">
                  <span>Capacity</span>
                  <strong>{event.capacity?.toLocaleString?.() ?? event.capacity} people</strong>
                </div>
                <div className="event-footer">
                  <span className="event-label">{event.category}</span>
                  <button className="event-action btn-chi-tiet" type="button" onClick={() => navigate(`/event/${event.id}`)}>
                    Chi tiết sự kiện
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {!loading && !error && filteredEvents.length > 0 && (
        <div className="pagination-bar" aria-label="Event pagination">
          <p className="pagination-summary">
            Showing {firstEventNumber}-{lastEventNumber} of {filteredEvents.length} events
          </p>
          <div className="pagination-controls">
            <button
              type="button"
              className="pagination-button"
              disabled={currentPage === 1}
              onClick={() => onPageChange(currentPage - 1)}
            >
              Previous
            </button>
            {pageNumbers.map((pageNumber) => (
              <button
                key={pageNumber}
                type="button"
                className={`pagination-button page-number ${currentPage === pageNumber ? 'active' : ''}`}
                aria-current={currentPage === pageNumber ? 'page' : undefined}
                onClick={() => onPageChange(pageNumber)}
              >
                {pageNumber}
              </button>
            ))}
            <button
              type="button"
              className="pagination-button"
              disabled={currentPage === totalPages}
              onClick={() => onPageChange(currentPage + 1)}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default HomeContent;
