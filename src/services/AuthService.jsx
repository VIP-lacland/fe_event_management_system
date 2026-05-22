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





