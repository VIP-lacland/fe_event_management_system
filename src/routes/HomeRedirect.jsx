// src/components/HomeRedirect.jsx
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { AuthLoding } from '../components/loading/AuthLoading';
// Optional: chỉ dùng khi cần fetch fresh data (edge case)
// import { getUser } from '../services/UserService';

export function HomeRedirect() {
  const navigate = useNavigate();
  // lấy user đã đăng nhập từ store
  const { user, isAuthenticated, checkAuth } = useAuthStore();

  useEffect(() => {
    const handleRedirect = async () => {
      // store chưa có user → thử restore từ localStorage
      if (!user && !isAuthenticated) {
        const restored = checkAuth();
        if (!restored) {
          // Không có auth → về login
          navigate('/login', { replace: true });
          return;
        }
      }

      // Đã có user → redirect theo role
      // Dùng user từ store (đã được checkAuth hoặc login trước đó)
      const currentUser = user || useAuthStore.getState().user;
      
      if (!currentUser?.role) {
        // role không rõ → về login
        navigate('/login', { replace: true });
        return;
      }

      // Redirect theo role
      switch (currentUser.role) {
        case 'organizer':
          navigate('/organizer/home', { replace: true });
          break;
        case 'attendee':
          navigate('/attendee/home', { replace: true });
          break;
        default:
          navigate('/login', { replace: true });
      }
    };

    handleRedirect();
  }, [navigate, user, isAuthenticated, checkAuth]);

  // ✅ Hiển thị loading trong lúc check auth (trải nghiệm tốt hơn)
  AuthLoding();
}