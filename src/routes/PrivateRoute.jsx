// src/components/auth/ProtectedRoute.jsx
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import Loading from '../ui/Loading/Loading'; // Optional: nếu muốn hiển thị loading

const ProtectedRoute = ({ children, role }) => {
  const { user, isAuthenticated, checkAuth } = useAuthStore();
  const location = useLocation();

  // ✅ Bước 1: Nếu chưa có user trong store → thử restore từ localStorage
  if (!user && !isAuthenticated) {
    const restored = checkAuth();
    if (!restored) {
      // Không restore được → chưa login → về login + lưu lại trang đích
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
  }

  // ✅ Bước 2: Lấy user hiện tại (từ store hoặc vừa restore)
  const currentUser = user || useAuthStore.getState().user;

  // ✅ Bước 3: Check role nếu có yêu cầu
  if (role && currentUser?.role !== role) {
    // Role không khớp → redirect về forbidden hoặc dashboard mặc định
    return <Navigate to="/forbidden" replace />;
  }

  // ✅ Bước 4: Đã auth + role OK → render children
  return children;
};

export default ProtectedRoute;