import { useState, useCallback } from 'react';
import api from '../services/api';

export const useProfile = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [statusFilter, setStatusFilter] = useState(null);

  // ✅ Fetch profile info + stats
  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/attendee/profile');
      setUser(res.data.user);
      setStats(res.data.stats);
    } catch (err) {
      setError('Failed to load profile information.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ Update profile (Name/Email)
  const updateProfile = useCallback(async (formData) => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.put('/attendee/profile', formData);
      setUser(res.data.user);
      setToast('Profile updated successfully!');
      setTimeout(() => setToast(null), 3000);
      return true;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update profile.';
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ Fetch tickets với filter + pagination
  const fetchTickets = useCallback(async (page = 1, status = null) => {
    try {
      setLoading(true);
      const params = { page };
      if (status) params.status = status;
      
      const res = await api.get('/attendee/profile/tickets', { params });
      setTickets(res.data.data || []);
      setPagination(res.data.pagination);
    } catch (err) {
      console.error(err);
      setTickets([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ Cancel ticket: WAIT for API success before update
  const cancelTicket = useCallback(async (eventId) => {
    // Show confirm popup
    if (!window.confirm('Are you sure you want to cancel your registration for this event?')) {
      return false;
    }

    try {
      setLoading(true);
      await api.delete(`/attendee/profile/tickets/${eventId}`);
      
      // ✅ API success → refresh tickets list để update status
      await fetchTickets(pagination?.current_page || 1, statusFilter);
      
      setToast('Registration cancelled successfully!');
      setTimeout(() => setToast(null), 3000);
      return true;
    } catch (err) {
      // ✅ Error 403/404/500 → toast error message
      console.error(err);
      setToast('System error. Please try again later.');
      setTimeout(() => setToast(null), 4000);
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchTickets, pagination, statusFilter]);

  // ✅ Clear error block
  const clearError = useCallback(() => setError(null), []);

  // ✅ Initial load
  const initialize = useCallback(() => {
    fetchProfile();
    fetchTickets(1, null);
  }, [fetchProfile, fetchTickets]);

  return {
    // State
    user, stats, tickets, pagination, loading, error, toast,
    activeTab, statusFilter,
    
    // Actions
    setActiveTab, setStatusFilter,
    fetchProfile, updateProfile, fetchTickets, cancelTicket,
    clearError, initialize,
    
    // Helpers
    isEditing: loading && !error,
  };
};