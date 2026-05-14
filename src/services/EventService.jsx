import api from './api';

export const EventService = {
  fetchEvents: (filters = {}) =>
    api.get('/events', { params: filters }).then((response) => response.data.data),

  fetchEventById: (eventId) =>
    api.get(`/events/${eventId}`).then((response) => response.data.data),
};
