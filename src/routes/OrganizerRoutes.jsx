// src/routes/OrganizerRoutes.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import OrganizerLayout from "../components/layouts/MainLayouts/OrganizerLayout";
import PrivateRoute from "./PrivateRoute";

// Pages
import HomePage from "../pages/organizer/Home/Home";
// import OrganizerDashboard from "../pages/organizer/Dashboard/OrganizerDashboard";
// import OrganizerCreateEvent from "../pages/organizer/Events/OrganizerCreateEvent";

// ✅ Route config: path RELATIVE (bỏ /organizer/ prefix)
const organizerRoutes = [
  { path: 'home', element: <HomePage /> },
//   { path: 'dashboard', element: <OrganizerDashboard /> },
//   { path: 'events/create', element: <OrganizerCreateEvent /> },
];

export function OrganizerRoutes() {
  return (
    /* ✅ BẮT BUỘC: Bọc trong <Routes> */
    <Routes>
      {/* Redirect /organizer → /organizer/home */}
      <Route path="/" element={<Navigate to="home" replace />} />
      <Route 
        element={
          <PrivateRoute role="organizer">
            <OrganizerLayout />
          </PrivateRoute>
        }
      >
        {organizerRoutes.map(({ path, element }) => (
          <Route 
            key={path} 
            path={path} 
            element={element} 
          />
        ))}
      </Route>
      <Route path="*" element={<Navigate to="home" replace />} />
    </Routes>
  );
}