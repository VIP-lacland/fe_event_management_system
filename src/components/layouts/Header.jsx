import { Link } from 'react-router-dom';

// Header layout component for the attendee homepage
// Bao gồm logo và điều hướng chính của ứng dụng
const Header = () => {
  return (
    <header className="homepage-topbar">
      <div className="homepage-brand">Eventify</div>
      <nav className="homepage-nav" aria-label="Main navigation">
        <button className="homepage-button" type="button">Update</button>
        <button className="homepage-button" type="button">Find event</button>
        <button className="homepage-button" type="button">Create event</button>
        <button className="homepage-button" type="button">Help center</button>
        <button className="homepage-button" type="button">Find my tickets</button>
        <Link to="/login" className="homepage-action primary">Login</Link>
      </nav>
    </header>
  );
};

export default Header;
