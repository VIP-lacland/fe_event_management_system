import api from "./api";

/**
 * Lấy danh sách sự kiện với bộ lọc
 * @param {Object} params - { page, limit, category, status, search }
 */
export const GetEvents = async (params = {}) => {
  const response = await api.get('/organizer/events', { params });
  return response.data; 
};

/**
 * Lấy chi tiết sự kiện theo ID
 * @param {number|string} id - ID của sự kiện
 */
export const GetEventById = async (id) => {
  const response = await api.get(`/organizer/events/${id}`);
  return response.data; // { event, message }
};

/**
 * Tạo sự kiện mới
 * @param {Object} eventData - { title, description, category, location, event_date, capacity, status }
 */
export const CreateEvent = async (eventData) => {
  const response = await api.post('/organizer/events', eventData);
  return response.data; // { event, message }
};

/**
 * Cập nhật sự kiện theo ID
 * @param {number|string} id - ID của sự kiện
 * @param {Object} eventData - Các trường cần cập nhật
 */
export const UpdateEvent = async (id, eventData) => {
  const response = await api.put(`/organizer/events/${id}`, eventData);
  return response.data; // { event, message }
};

/**
 * Xóa sự kiện theo ID
 * @param {number|string} id - ID của sự kiện cần xóa
 */
export const DeleteEvent = async (id) => {
  const response = await api.delete(`/organizer/events/${id}`);
  return response.data; // { message }
};

/**
 * Thay đổi trạng thái sự kiện (draft / published / cancelled)
 * @param {number|string} id - ID của sự kiện
 * @param {'draft'|'published'|'cancelled'} status - Trạng thái mới
 */
export const UpdateEventStatus = async (id, status) => {
  const response = await api.patch(`/organizer/events/${id}/status`, { status });
  return response.data; // { event, message }
};