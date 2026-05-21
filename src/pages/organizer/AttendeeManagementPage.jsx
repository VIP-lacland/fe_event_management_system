import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { GetRegistrations, UpdateRegistrationStatus, GetEventById } from '../../services/EventService';
import './AttendeeManagementPage.css';

const AttendeeManagementPage = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, [eventId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [eventRes, regRes] = await Promise.all([
        GetEventById(eventId),
        GetRegistrations(eventId)
      ]);
      setEvent(eventRes.event);
      setRegistrations(regRes.data || []);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Error loading attendees.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (registrationId, newStatus) => {
    try {
      await UpdateRegistrationStatus(eventId, registrationId, newStatus);
      // Update local state
      setRegistrations(registrations.map(reg => {
        if (reg.id === registrationId) {
          return { ...reg, status: newStatus };
        }
        return reg;
      }));
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating status');
    }
  };

  return (
    <div className="attendee-management-container" style={{ padding: '2rem' }}>
      <div className="attendee-management-header">
          <div>
            <Link to="/organizer" className="back-link">← Back to Dashboard</Link>
            <h1>Attendee Management</h1>
            {event && <p className="event-subtitle">{event.title}</p>}
          </div>
        </div>

        {loading ? (
          <div className="loading-state">Loading attendees...</div>
        ) : error ? (
          <div className="error-state">{error}</div>
        ) : (
          <div className="table-container">
            <table className="attendee-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Date Registered</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {registrations.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="empty-row">No attendees registered yet.</td>
                  </tr>
                ) : (
                  registrations.map(reg => (
                    <tr key={reg.id}>
                      <td>{reg.attendee?.name || 'Unknown'}</td>
                      <td>{reg.attendee?.email || 'N/A'}</td>
                      <td>{new Date(reg.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                      <td>
                        <span className={`status-badge status-${reg.status}`}>
                          {reg.status.charAt(0).toUpperCase() + reg.status.slice(1)}
                        </span>
                      </td>
                      <td>
                        {reg.status === 'pending' && (
                          <div className="action-buttons">
                            <button className="btn-approve" onClick={() => handleUpdateStatus(reg.id, 'confirmed')}>Approve</button>
                            <button className="btn-reject" onClick={() => handleUpdateStatus(reg.id, 'rejected')}>Reject</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
    </div>
  );
};

export default AttendeeManagementPage;
