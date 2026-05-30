import api from "./api";

export const EventService = {
  fetchEvents: async (filters = {}) => {
    const response = await api.get("/events", { params: filters });
    // Backend returns paginated: { data: { data: [...], current_page, ... } }
    const payload = response.data?.data ?? response.data;
    const items = Array.isArray(payload) ? payload : (payload?.data ?? []);
    return { data: items };
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
    const response = await api.patch(`/organizer/events/${id}/status`, {
      status,
    });
    return response.data;
  },

  registerEvent: async (eventId, formData = {}) => {
    const response = await api.post(`/events/${eventId}/register`, formData);
    return {
      data: response.data,
      status: response.data.status,
      waitlistPosition: response.data.waitlist_position,
      message: response.data.message,
    };
  },

  getMyTickets: async () => {
    const response = await api.get("/attendee/tickets");
    return response.data;
  },

  cancelTicket: async (eventId) => {
    const response = await api.delete(`/attendee/tickets/${eventId}`);
    return {
      data: response.data,
      autoPromoted: response.data.auto_promoted, // true nếu có người được promote
    };
  },

  getEventReviews: async (eventId) => {
    const response = await api.get(`/events/${eventId}/reviews`);
    return response.data;
  },

  createEventReview: async (eventId, payload) => {
    const response = await api.post(`/events/${eventId}/reviews`, payload);
    return response.data;
  },

  getRegistrations: async (eventId) => {
    const response = await api.get(
      `/organizer/events/${eventId}/registrations`,
    );
    return response.data;
  },

  updateRegistrationStatus: async (eventId, registrationId, status) => {
    const response = await api.patch(
      `/organizer/events/${eventId}/registrations/${registrationId}/status`,
      { status },
    );
    return response.data;
  },
};

export const GetEvents = EventService.getEvents;
export const GetEventById = EventService.getEventById;
export const CreateEvent = EventService.createEvent;
export const UpdateEvent = EventService.updateEvent;
export const DeleteEvent = EventService.deleteEvent;
export const UpdateEventStatus = EventService.updateEventStatus;
export const GetMyTickets = EventService.getMyTickets;
export const CancelTicket = EventService.cancelTicket;
export const GetRegistrations = EventService.getRegistrations;
export const UpdateRegistrationStatus = EventService.updateRegistrationStatus;
export const PromoteFromWaitlist = EventService.promoteFromWaitlist;
