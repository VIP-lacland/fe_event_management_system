// src/routes/GuestRoutes.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/guest/LoginPage';
import HomePage from '../pages/HomePage';
// import RegisterPage from '../pages/guest/RegisterPage'; // Nếu có

export function GuestRoutes() {
  return (

    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      {/* <Route path="/register" element={<RegisterPage />} /> */}

      {/* Default redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}