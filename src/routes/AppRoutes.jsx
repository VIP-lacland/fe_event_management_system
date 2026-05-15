// src/routes/AppRoutes.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { GuestRoutes } from "./GuestRoutes";
import { OrganizerRoutes } from "./OrganizerRoutes";
import { HomeRedirect } from "./HomeRedirect";
// import { AttendeeRoutes } from "./AttendeeRoutes"; // Nếu có

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login/*" element={<GuestRoutes />} />
        <Route path="/register/*" element={<GuestRoutes />} />
        <Route path="/" element={<HomeRedirect />} />
        <Route path="/organizer/*" element={<OrganizerRoutes />} />

        {/* ✅ Attendee routes - protected (nếu có) */}
        {/* <Route path="/attendee/*" element={<AttendeeRoutes />} /> */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
