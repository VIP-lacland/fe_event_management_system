import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { EventService } from '../../services/EventService';
import { useAuthStore } from '../../store/authStore';
import './EventRegistrationPage.css';

const EventRegistrationPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Fake payment state
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');

  useEffect(() => {
    const loadEvent = async () => {
      try {
        const { data } = await EventService.fetchEventById(eventId);
        setEvent(data);
      } catch (err) {
        setError('Failed to load event information.');
      } finally {
        setLoading(false);
      }
    };
    if (eventId) {
      loadEvent();
    }
  }, [eventId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Fake validation for paid events
    if (event?.price > 0) {
      if (!cardNumber || !expiry || !cvc) {
        setError('Please fill in all payment details to checkout.');
        return;
      }
    }

    setSubmitting(true);
    setError('');
    
    try {
      // Simulate processing time
      if (event?.price > 0) {
        await new Promise(resolve => setTimeout(resolve, 1500));
      }

      await EventService.registerEvent(eventId);
      
      setSuccess(true);
      
      // Wait 4 seconds then redirect
      setTimeout(() => {
        navigate(`/my-tickets`);
      }, 4000);
      
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="registration-page loading">Loading event information...</div>;
  }

  if (error && !event) {
    return <div className="registration-page error">{error}</div>;
  }

  const isFree = !event.price || event.price === 0 || event.price === '0.00';

  return (
    <div className="registration-page">
      <div className="registration-container">
        <Link to={`/event/${eventId}`} className="back-link">← Back to Event</Link>
        
        <div className="registration-card">
          <div className="registration-header">
            <h2>{isFree ? 'Register for Event' : 'Checkout & Register'}</h2>
            <p className="event-title">{event.title}</p>
            <p className="event-price">Total: {isFree ? 'Free' : `$${parseFloat(event.price).toFixed(2)}`}</p>
          </div>

          <form className="registration-form" onSubmit={handleSubmit}>
            {error && <div className="form-error">{error}</div>}
            
            <div className="form-section">
              <h3>Attendee Information</h3>
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" value={user?.name || ''} readOnly className="read-only-input" />
              </div>
              
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" value={user?.email || ''} readOnly className="read-only-input" />
              </div>
            </div>

            {!isFree && (
              <div className="form-section payment-section">
                <h3>Payment Details</h3>
                <div className="form-group">
                  <label>Card Number</label>
                  <input 
                    type="text" 
                    placeholder="0000 0000 0000 0000" 
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    required 
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Expiry (MM/YY)</label>
                    <input 
                      type="text" 
                      placeholder="MM/YY" 
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>CVC</label>
                    <input 
                      type="text" 
                      placeholder="123" 
                      value={cvc}
                      onChange={(e) => setCvc(e.target.value)}
                      required 
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="form-notice">
              <p>Please review your information carefully before confirming.</p>
            </div>

            <button type="submit" className="confirm-btn" disabled={submitting}>
              {submitting ? 'Processing...' : (isFree ? 'Confirm Registration' : 'Pay & Register')}
            </button>
          </form>
        </div>
      </div>

      {/* Success Popup Overlay */}
      {success && (
        <div className="popup-overlay">
          <div className="popup-content">
            <div className="popup-icon">✅</div>
            <h3>{isFree ? 'Registration Complete!' : 'Payment Successful!'}</h3>
            <p className="popup-msg">
              {isFree 
                ? "Your registration is complete, please wait for the organizer's approval."
                : "Your registration is complete and confirmed."}
            </p>
            <p className="popup-redirect">Redirecting to your tickets in a few seconds...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventRegistrationPage;
