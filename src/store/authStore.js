// src/store/authStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Logout as logoutService } from '../services/AuthService';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      // Axios interceptor đọc từ đây
      login: (user, token) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        set({ user, token, isAuthenticated: true });
      },

      
      logout: async () => {
        await logoutService();

        localStorage.removeItem('token');
        localStorage.removeItem('user');
        set({ user: null, token: null, isAuthenticated: false });
      },

      // Method checkAuth - PHẢI CÓ để fix lỗi
      checkAuth: () => {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');
        
        if (token && userStr) {
          try {
            const user = JSON.parse(userStr);
            set({ user, token, isAuthenticated: true });
            return true;
          } catch (error) {
            console.error('Parse user error:', error);
            get().logout(); // Clear nếu parse lỗi
          }
        }
        return false;
      },
    }),
    { 
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);