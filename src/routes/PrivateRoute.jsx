// src/components/auth/ProtectedRoute.jsx
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const ProtectedRoute = ({ children, role }) => {
  const { user, isAuthenticated, checkAuth } = useAuthStore();
  const location = useLocation();

  if (!user && !isAuthenticated) {
    const restored = checkAuth();
    if (!restored) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
  }

  const currentUser = user || useAuthStore.getState().user;

  if (role && currentUser?.role !== role) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;