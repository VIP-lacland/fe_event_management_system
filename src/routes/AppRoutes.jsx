// src/routes/AppRoutes.jsx
import { createBrowserRouter } from "react-router-dom";
import OrganizerLayout from "../components/layouts/MainLayouts/OrganizerLayout";
import { getOrganizerRoutes } from "./OrganizerRoutes";
import LoginPage from "../pages/guest/LoginPage";
import ProtectedRoute from "./ProtectedRoute";

const publicRoutes = [
  {
    path: "/",
    element: <LoginPage />,
    handle: { public: true },
  },
  {
    path: "/login",
    element: <LoginPage />,
    handle: { public: true },
  },
  {
    path: "/register",
    element: <LoginPage />, // Tạm dùng LoginPage
    handle: { public: true },
  },
];

const router = createBrowserRouter([
  ...publicRoutes,
  {
    path: "/organizer",
    element: (
      <ProtectedRoute allowedRoles={["organizer"]}>
        <OrganizerLayout />
      </ProtectedRoute>
    ),
    handle: { requiresAuth: true, allowedRoles: ["organizer"] },
    children: getOrganizerRoutes(), // Import từ module
  },
]);

export default router;
