import api from "./api";

export const EventService = {
  fetchEvents: async (filters = {}) => {
    const response = await api.get("/events", { params: filters });
    return { data: response.data?.data ?? [] };
  },

  fetchEventById: async (eventId) => {
    const response = await api.get(`/events/${eventId}`);
    return { data: response.data?.data ?? null };
  },

  getEvents: async (params = {}) => {
    const response = await api.get("/organizer/events", { params });
    return response.data;
  },

  getEventById: async (id) => {
    const response = await api.get(`/organizer/events/${id}`);
    return response.data;
  },

  createEvent: async (eventData) => {
    const response = await api.post("/organizer/events", eventData);
    return response.data;
  },

  updateEvent: async (id, eventData) => {
    const response = await api.put(`/organizer/events/${id}`, eventData);
    return response.data;
  },

  deleteEvent: async (id) => {
    const response = await api.delete(`/organizer/events/${id}`);
    return response.data;
  },

  updateEventStatus: async (id, status) => {
    const response = await api.patch(`/organizer/events/${id}/status`, { status });
    return response.data;
  },
};

export const GetEvents = EventService.getEvents;
export const GetEventById = EventService.getEventById;
export const CreateEvent = EventService.createEvent;
export const UpdateEvent = EventService.updateEvent;
export const DeleteEvent = EventService.deleteEvent;
export const UpdateEventStatus = EventService.updateEventStatus;
