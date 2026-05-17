import api from './api';

export const EventService = {
  fetchEvents: async (filters = {}) => {
    const response = await api.get('/events', { params: filters });
    return { data: response.data?.data ?? [] };
  },

  fetchEventById: async (eventId) => {
    const response = await api.get(`/events/${eventId}`);
    return { data: response.data?.data ?? null };
  },
};
