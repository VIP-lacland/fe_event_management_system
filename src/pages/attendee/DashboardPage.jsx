import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAttendeeDashboardData } from '../../services/AttendeeDashboardService';
import Header from '../../components/layouts/Header';
import Footer from '../../components/layouts/Footer';
import './DashboardPage.css';

const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const data = await getAttendeeDashboardData();
      setDashboardData(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Error loading dashboard data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-page">
        <Header />
        <main className="dashboard-main">
          <div className="dashboard-loading">Loading your dashboard...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-page">
        <Header />
        <main className="dashboard-main">
          <div className="dashboard-error">
            <p>{error}</p>
            <button onClick={fetchDashboardData} className="btn-primary">
              Retry
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const { metrics, charts, recent_registrations, pending_approval_registrations } = dashboardData;

  return (
    <div className="dashboard-page">
      <Header />
      
      <main className="dashboard-main">
        <div className="dashboard-container">
          <h1 className="dashboard-title">My Dashboard</h1>
          
          {/* Metrics Cards */}
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-icon total">📝</div>
              <div className="metric-content">
                <span className="metric-value">{metrics?.total_registrations || 0}</span>
                <span className="metric-label">Total Registrations</span>
              </div>
            </div>
            
            <div className="metric-card">
              <div className="metric-icon pending">⏳</div>
              <div className="metric-content">
                <span className="metric-value">{metrics?.pending_registrations || 0}</span>
                <span className="metric-label">Pending Approval</span>
              </div>
            </div>
            
            <div className="metric-card">
              <div className="metric-icon confirmed">✅</div>
              <div className="metric-content">
                <span className="metric-value">{metrics?.confirmed_registrations || 0}</span>
                <span className="metric-label">Confirmed</span>
              </div>
            </div>
            
            <div className="metric-card">
              <div className="metric-icon waitlist">📋</div>
              <div className="metric-content">
                <span className="metric-value">{metrics?.waitlist_registrations || 0}</span>
                <span className="metric-label">Waitlist</span>
              </div>
            </div>
            
            <div className="metric-card">
              <div className="metric-icon cancelled">❌</div>
              <div className="metric-content">
                <span className="metric-value">{metrics?.cancelled_registrations || 0}</span>
                <span className="metric-label">Cancelled/Rejected</span>
              </div>
            </div>
            
            <div className="metric-card">
              <div className="metric-icon upcoming">📅</div>
              <div className="metric-content">
                <span className="metric-value">{metrics?.upcoming_events || 0}</span>
                <span className="metric-label">Upcoming Events</span>
              </div>
            </div>
          </div>

          {/* Pending Approval Section */}
          {pending_approval_registrations && pending_approval_registrations.length > 0 && (
            <div className="dashboard-section">
              <h2 className="section-title">⏳ Pending Approval</h2>
              <p className="section-description">
                These registrations are waiting for organizer approval
              </p>
              <div className="registrations-list">
                {pending_approval_registrations.map((reg) => (
                  <div key={reg.id} className="registration-card pending">
                    <div className="registration-header">
                      <span className="status-badge pending">Pending</span>
                      <span className="registration-date">
                        Registered: {new Date(reg.created_at).toLocaleDateString('en-US')}
                      </span>
                    </div>
                    <h3 className="registration-event-title">{reg.event_title}</h3>
                    <div className="registration-details">
                      <span>📍 {reg.event_location}</span>
                      <span>📅 {new Date(reg.event_date).toLocaleDateString('en-US')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Registrations */}
          <div className="dashboard-section">
            <h2 className="section-title">📝 Recent Registrations</h2>
            {recent_registrations && recent_registrations.length > 0 ? (
              <div className="registrations-list">
                {recent_registrations.map((reg) => (
                  <div key={reg.id} className={`registration-card ${reg.status}`}>
                    <div className="registration-header">
                      <span className={`status-badge ${reg.status}`}>
                        {reg.status === 'confirmed' ? 'Confirmed' : 
                         reg.status === 'pending' ? 'Pending' : 
                         reg.status === 'waitlist' ? 'Waitlist' : 
                         reg.status === 'cancelled' ? 'Cancelled' : 'Rejected'}
                      </span>
                      <span className="registration-date">
                        {new Date(reg.created_at).toLocaleDateString('en-US')}
                      </span>
                    </div>
                    <h3 className="registration-event-title">{reg.event_title}</h3>
                    <div className="registration-details">
                      <span>🏷️ {reg.event_category}</span>
                      <span>📍 {reg.event_location}</span>
                      <span>📅 {new Date(reg.event_date).toLocaleDateString('en-US')}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>You haven't registered for any events yet.</p>
                <Link to="/" className="btn-primary">Discover Events</Link>
              </div>
            )}
          </div>

          {/* Charts Section */}
          {charts && (
            <div className="charts-section">
              {/* Registrations by Category */}
              {charts.registrations_by_category && charts.registrations_by_category.length > 0 && (
                <div className="chart-card">
                  <h3 className="chart-title">Registrations by Category</h3>
                  <div className="chart-content">
                    {charts.registrations_by_category.map((item) => (
                      <div key={item.category} className="category-bar">
                        <span className="category-name">{item.category}</span>
                        <div className="bar-container">
                          <div 
                            className="bar" 
                            style={{ 
                              width: `${(item.total / metrics.total_registrations) * 100}%` 
                            }}
                          />
                        </div>
                        <span className="category-count">{item.total}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Registrations per Month */}
              {charts.registrations_per_month && charts.registrations_per_month.length > 0 && (
                <div className="chart-card">
                  <h3 className="chart-title">Registrations per Month (Last 6 Months)</h3>
                  <div className="chart-content month-chart">
                    {charts.registrations_per_month.map((item) => (
                      <div key={item.month} className="month-bar">
                        <span className="month-name">
                          {new Date(item.year, item.month - 1).toLocaleDateString('en-US', { month: 'short' })}
                        </span>
                        <div className="bar-container vertical">
                          <div 
                            className="bar vertical" 
                            style={{ 
                              height: `${Math.max((item.total / Math.max(...charts.registrations_per_month.map(m => m.total))) * 100, 10)}%` 
                            }}
                          />
                        </div>
                        <span className="month-count">{item.total}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DashboardPage;