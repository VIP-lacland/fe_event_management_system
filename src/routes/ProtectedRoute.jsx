import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";


const ProtectedRoute = ({ allowedRoles, children }) => {
  
  const location = useLocation();
  const { user, isAuthenticated, checkAuth } = useAuthStore();

  if (!isAuthenticated && !user) {
    checkAuth();
  }

  const currentUser = user || useAuthStore.getState().user;

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    console.warn("Role not allowed:", currentUser.role, allowedRoles);
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
