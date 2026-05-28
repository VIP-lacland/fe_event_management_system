import './ProfileSidebar.css';

const ProfileSidebar = ({ activeTab, onTabChange, stats }) => {
  return (
    <aside className="profile-sidebar">
      <nav className="profile-nav">
        <button
          className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => onTabChange('profile')}
        >
          <span className="nav-icon">👤</span>
          <span className="nav-label">Profile Settings</span>
        </button>
        
        <button
          className={`nav-item ${activeTab === 'tickets' ? 'active' : ''}`}
          onClick={() => onTabChange('tickets')}
        >
          <span className="nav-icon">🎫</span>
          <span className="nav-label">My Tickets</span>
          {stats?.total_registered > 0 && (
            <span className="nav-badge">{stats.total_registered}</span>
          )}
        </button>
      </nav>
      
      <div className="sidebar-footer">
        <small>Need help? <a href="/support">Contact us</a></small>
      </div>
    </aside>
  );
};

export default ProfileSidebar;