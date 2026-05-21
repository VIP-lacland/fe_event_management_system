// service/AuthServices
import api from "./api";

export const Login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data; // { token, user, message }
};

// src/store/authStore.js
export const Logout = async () => {
  try {
    await api.post('/auth/logout');
  } catch (error) {
    console.warn('Logout API error:', error);
  } finally {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

export const Register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

/**
 * Xác thực email với token từ link trong mail
 * @param {string} email - Email của user
 * @param {string} token - Token từ URL link
 * @returns {Promise<Object>} - { success: boolean, message: string }
 */
export const VerifyEmail = async (email, token) => {
  const response = await api.get('/auth/verify-email', {
    params: { email, token }
  });
  return response.data;
};

/**
 * Gửi lại email xác thực
 * @param {string} email - Email cần gửi lại
 * @returns {Promise<Object>} - { success: boolean, message: string }
 */
export const ResendVerification = async (email) => {
  const response = await api.post('/auth/resend-verification', { email });
  return response.data;
};

/**
 * Lấy URL redirect để bắt đầu Google OAuth flow
 * @returns {Promise<string>} - Google OAuth URL
 */
export const GetGoogleAuthUrl = async () => {
  const response = await api.get('/auth/google/redirect');
  return response.data.url;
};

/**
 * Lấy thông tin user hiện tại (cần token trong header)
 * @returns {Promise<Object|null>} - User info hoặc null nếu lỗi
 */
export const GetCurrentUser = async () => {
  try {
    const response = await api.get('/auth/me');
    return response.data.user;
  } catch (error) {
    console.warn('GetCurrentUser error:', error);
    return null;
  }
};

/**
 * Helper: Kiểm tra user có cần verify email không
 * @param {Object} user - User object từ API
 * @returns {boolean}
 */
export const NeedsVerification = (user) => {
  return user?.email && !user?.email_verified_at;
};

/**
 * Helper: Lưu token và user vào localStorage + set auth header
 * @param {string} token 
 * @param {Object} user 
 */
export const SaveAuthData = (token, user) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
  // Set default header cho các request sau
  if (api.defaults.headers.common) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
};

/**
 * Helper: Xóa auth data khỏi localStorage + xóa header
 */
export const ClearAuthData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  if (api.defaults.headers.common) {
    delete api.defaults.headers.common['Authorization'];
  }
};

/**
 * Helper: Kiểm tra user đã login chưa
 * @returns {boolean}
 */
export const IsAuthenticated = () => {
  return !!localStorage.getItem('token');
};

/**
 * Helper: Lấy user từ localStorage (không call API)
 * @returns {Object|null}
 */
export const GetStoredUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};