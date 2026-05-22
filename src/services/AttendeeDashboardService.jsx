import api from "./api";

/**
 * Lấy toàn bộ data dashboard của attendee
 * GET /api/attendee/dashboard
 */
export const getAttendeeDashboardData = async () => {
  const response = await api.get("/attendee/dashboard");
  return response.data;
};