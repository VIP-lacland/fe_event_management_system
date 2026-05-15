// src/routes/OrganizerRoutes.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { EditEventPage } from '../pages/EditEventPage';

export function OrganizerRoutes() {
  return (
    <Routes>
      <Route path="/events/:eventId/edit" element={<EditEventPage />} />
      
      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/events" replace />} />
    </Routes>
  );
}
