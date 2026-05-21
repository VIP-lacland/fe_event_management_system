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

export const getCurrentUser = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

export const verifyEmail = async (id, hash) => {
  const response = await api.get(`/auth/email/verify/${id}/${hash}`);
  return response.data;
};

export const resendVerification = async (email) => {
  const response = await api.post('/auth/email/resend', { email });
  return response.data;
};

/**
 * Lưu token và user vào localStorage sau khi login thành công
 * @param {Object} responseData - response từ API login/register
 */
export const saveAuthData = (responseData) => {
  if (responseData.token && responseData.user) {
    localStorage.setItem('token', responseData.token);
    localStorage.setItem('user', JSON.stringify(responseData.user));
    return true;
  }
  return false;
};

/**
 * Kiểm tra user đã đăng nhập chưa
 * @returns {boolean}
 */
export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

/**
 * Lấy user từ localStorage
 * @returns {Object|null}
 */
export const getStoredUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

/**
 * Lấy token từ localStorage
 * @returns {string|null}
 */
export const getToken = () => {
  return localStorage.getItem('token');
};