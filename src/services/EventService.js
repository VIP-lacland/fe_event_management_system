// src/services/EventService.js
import api from './api';

export const EventService = {
  /**
   * Get all events for organizer
   */
  getEvents: async () => {
    try {
      const response = await api.get('/organizer/events');
      return response.data;
    } catch (error) {
      console.error('Error fetching events:', error);
      throw error;
    }
  },

  /**
   * Get single event by ID
   */
  getEventById: async (id) => {
    try {
      const response = await api.get(`/organizer/events/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching event:', error);
      throw error;
    }
  },

  /**
   * Update event (all fields)
   */
  updateEvent: async (id, eventData) => {
    try {
      const response = await api.put(`/organizer/events/${id}`, eventData);
      return response.data;
    } catch (error) {
      console.error('Error updating event:', error);
      throw error;
    }
  },

  /**
   * Update only event status
   */
  updateEventStatus: async (id, status) => {
    try {
      const response = await api.patch(`/organizer/events/${id}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating event status:', error);
      throw error;
    }
  },
};
