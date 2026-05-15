// service/EventService.js
import api from "./api";

export const GetEvents = async (params = {}) => {
  const response = await api.get('/events', { params });
  return response.data; 
};


export const GetEventById = async (id) => {
  const response = await api.get(`/events/${id}`);
  return response.data; // { event, message }
};

/**
 * Tạo sự kiện mới
 * @param {Object} eventData - { title, description, category, location, event_date, capacity, status }
 */
export const CreateEvent = async (eventData) => {
  const response = await api.post('/events', eventData);
  return response.data; // { event, message }
};

/**
 * Cập nhật sự kiện theo ID
 * @param {number} id - ID của sự kiện
 * @param {Object} eventData - Các trường cần cập nhật
 */
export const UpdateEvent = async (id, eventData) => {
  const response = await api.put(`/events/${id}`, eventData);
  return response.data; // { event, message }
};


export const DeleteEvent = async (id) => {
  const response = await api.delete(`/events/${id}`);
  return response.data; // { message }
};

/**
 * Thay đổi trạng thái sự kiện (draft / published / cancelled)
 * @param {number} id
 * @param {'draft'|'published'|'cancelled'} status
 */
export const UpdateEventStatus = async (id, status) => {
  const response = await api.patch(`/events/${id}/status`, { status });
  return response.data; // { event, message }
};