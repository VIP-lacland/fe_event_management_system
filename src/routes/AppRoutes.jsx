// src/routes/AppRoutes.jsx
import { createBrowserRouter, Navigate } from "react-router-dom";
import OrganizerLayout from "../components/layouts/MainLayouts/OrganizerLayout";
import HomePage from "../pages/attendee/HomePage";
import LoginPage from "../pages/guest/LoginPage";
import RegisterPage from "../pages/guest/RegisterPage";
// import CreateEventForm from "../pages/organizer/event/CreateEventForm";
// import { EditEventPage } from "../pages/EditEventPage";
import { getOrganizerRoutes } from "./OrganizerRoutes";
import ProtectedRoute from "./ProtectedRoute";


const publicRoutes = [
  {
    path: "/",
    element: <HomePage />,
    handle: { public: true },
  },
  {
    path: "/login",
    element: <LoginPage />,
    handle: { public: true },
  },
  {
    path: "/register",
    element: <RegisterPage />,
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
    children: [
      {
        index: true,
        element: <Navigate to="home" replace />,
      },
      ...getOrganizerRoutes(),
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

export default router;
