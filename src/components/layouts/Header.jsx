import { Link } from 'react-router-dom';

// Header layout component for the attendee homepage
// Bao gồm logo và điều hướng chính của ứng dụng
const Header = () => {
  return (
    <header className="homepage-topbar">
      <div className="homepage-brand">Eventify</div>
      <nav className="homepage-nav" aria-label="Main navigation">
        <div className="homepage-nav-group">
          <button className="homepage-button" type="button">Find event</button>
          <button className="homepage-button" type="button">Help center</button>
          <button className="homepage-button" type="button">Find my tickets</button>
        </div>
        <Link to="/login" className="homepage-action primary">Login</Link>
      </nav>
    </header>
  );
};

export default Header;
