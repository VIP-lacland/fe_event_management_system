// src/App.jsx
import { useEffect } from 'react';
import { useAuthStore } from './store/authStore';

import { AppRoutes } from './routes/AppRoutes';


function App() {
  // ✅ Lấy method checkAuth từ store
  const checkAuth = useAuthStore((state) => state.checkAuth);
  
  // ✅ Gọi checkAuth khi App mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]); // Dependency: checkAuth

   return <AppRoutes />;
}

export default App;