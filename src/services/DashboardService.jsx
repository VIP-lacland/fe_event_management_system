// src/services/DashboardService.js
import api from "./api";


export const getDashboardData = async () => {
  const response = await api.get("/organizer/dashboard");
  return response.data;
};


export const getOrganizerEvents = async (params = {}) => {
  const response = await api.get("/organizer/events", { params });
  return response.data;
};


export const createEvent = async (eventData) => {
  const response = await api.post("/organizer/events", eventData);
  return response.data;
};


export const updateEvent = async (id, eventData) => {
  const response = await api.put(`/organizer/events/${id}`, eventData);
  return response.data;
};


export const deleteEvent = async (id) => {
  const response = await api.delete(`/organizer/events/${id}`);
  return response.data;
};


export const getEventRegistrations = async (eventId, params = {}) => {
  const response = await api.get(
    `/organizer/events/${eventId}/registrations`,
    { params }
  );
  return response.data;
};