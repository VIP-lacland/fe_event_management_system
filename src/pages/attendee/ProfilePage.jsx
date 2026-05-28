import { useEffect } from 'react';
import { useProfile } from '../../hooks/useProfile';
import ProfileSidebar from '../../components/layouts/Profile/ProfileSidebar';
import ProfileForm from '../../components/layouts/Profile/ProfileForm';
import TicketsTable from '../../components/layouts/Profile/TicketsTable';
import './ProfilePage.css';

const ProfilePage = () => {
  const {
    user, stats, tickets, pagination, loading, error, toast,
    activeTab, statusFilter,
    setActiveTab, setStatusFilter,
    updateProfile, cancelTicket, fetchTickets, clearError, initialize,
  } = useProfile();

  // ✅ Initial load khi mount
  useEffect(() => {
    initialize();
    
    // ✅ Listen cho event clear error từ ProfileForm
    const handleClearError = () => clearError();
    window.addEventListener('clearProfileError', handleClearError);
    
    return () => {
      window.removeEventListener('clearProfileError', handleClearError);
    };
  }, [initialize, clearError]);

  // ✅ Handle filter change từ TicketsTable
  const handleFilterChange = (page, status) => {
    setStatusFilter(status);
    fetchTickets(page, status);
  };

  return (
    <div className="profile-page">
      {/* Toast Notification */}
      {toast && (
        <div className="toast toast-success">
          {toast}
          <button className="toast-close" onClick={() => {}}>✓</button>
        </div>
      )}

      <div className="profile-layout">
        {/* Sidebar */}
        <ProfileSidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          stats={stats}
        />

        {/* Content */}
        <main className="profile-content">
          {/* Error Block - hiển thị trên cùng content */}
          {error && (
            <div className="error-block">
              <span>⚠ {error}</span>
              <button type="button" className="error-close" onClick={clearError}>×</button>
            </div>
          )}

          {/* Tabs Content */}
          {activeTab === 'profile' ? (
            <ProfileForm
              user={user}
              onSave={updateProfile}
              loading={loading}
              error={error}
            />
          ) : (
            <TicketsTable
              tickets={tickets}
              loading={loading}
              onCancel={cancelTicket}
              pagination={pagination}
              onFilterChange={handleFilterChange}
              currentFilter={statusFilter}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;