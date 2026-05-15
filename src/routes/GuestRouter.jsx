// src/routes/GuestRoutes.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/guest/LoginPage';
import CreateEventForm from '../pages/organizer/event/CreateEventForm';
// import RegisterPage from '../pages/guest/RegisterPage'; // Nếu có

export function GuestRoutes() {
  return (

    <Routes>
      <Route path="/login" element={<LoginPage />} />
      {/* <Route path="/register" element={<RegisterPage />} /> */}
      <Route path="/create-event" element={<CreateEventForm />} />
      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}