import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect về login, lưu lại trang định đến
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoute;