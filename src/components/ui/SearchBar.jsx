// Search bar component for event filtering
// Gọi callback onSearchChange mỗi khi người dùng nhập từ khóa mới
const SearchBar = ({ searchQuery, onSearchChange }) => {
  return (
    <form className="search-bar" onSubmit={(event) => event.preventDefault()}>
      <input
        type="search"
        aria-label="Search events"
        placeholder="Search events..."
        value={searchQuery}
        onChange={(event) => onSearchChange(event.target.value)}
      />
      <button type="submit">Search</button>
    </form>
  );
};

export default SearchBar;
