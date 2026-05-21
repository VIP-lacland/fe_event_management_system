// src/services/DashboardService.js
import api from "./api";

/**
 * Lấy toàn bộ data dashboard của organizer
 * GET /api/organizer/dashboard
 */
export const getDashboardData = async () => {
  const response = await api.get("/organizer/dashboard");
  return response.data;
};

/**
 * Lấy danh sách events của organizer
 * GET /api/organizer/events
 */
export const getOrganizerEvents = async (params = {}) => {
  const response = await api.get("/organizer/events", { params });
  return response.data;
};

/**
 * Tạo event mới
 * POST /api/organizer/events
 */
export const createEvent = async (eventData) => {
  const response = await api.post("/organizer/events", eventData);
  return response.data;
};

/**
 * Cập nhật event
 * PUT /api/organizer/events/:id
 */
export const updateEvent = async (id, eventData) => {
  const response = await api.put(`/organizer/events/${id}`, eventData);
  return response.data;
};

/**
 * Xoá event
 * DELETE /api/organizer/events/:id
 */
export const deleteEvent = async (id) => {
  const response = await api.delete(`/organizer/events/${id}`);
  return response.data;
};

/**
 * Lấy danh sách đăng ký của event
 * GET /api/organizer/events/:id/registrations
 */
export const getEventRegistrations = async (eventId, params = {}) => {
  const response = await api.get(
    `/organizer/events/${eventId}/registrations`,
    { params }
  );
  return response.data;
};