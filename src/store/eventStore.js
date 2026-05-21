// src/store/eventStore.js
import { create } from 'zustand';
import { EventService } from '../services/EventService';

export const useEventStore = create((set) => ({
  event: null,
  isLoading: false,
  error: null,

  /**
   * Fetch event by ID
   */
  fetchEventById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const data = await EventService.getEventById(id);
      set({ event: data.event || data, isLoading: false });
      return data.event || data;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || error.message,
        isLoading: false 
      });
      throw error;
    }
  },

  /**
   * Update event
   */
  updateEvent: async (id, eventData) => {
    set({ isLoading: true, error: null });
    try {
      const data = await EventService.updateEvent(id, eventData);
      set({ event: data.event, isLoading: false });
      return data.event;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || error.message,
        isLoading: false 
      });
      throw error;
    }
  },

  /**
   * Update event status only
   */
  updateEventStatus: async (id, status) => {
    set({ isLoading: true, error: null });
    try {
      const data = await EventService.updateEventStatus(id, status);
      set({ event: data.event, isLoading: false });
      return data.event;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || error.message,
        isLoading: false 
      });
      throw error;
    }
  },

  /**
   * Clear event
   */
  clearEvent: () => set({ event: null }),

  /**
   * Clear error
   */
  clearError: () => set({ error: null }),
}));
