// src/routes/AppRoutes.jsx
import { createBrowserRouter, Navigate } from "react-router-dom";
import OrganizerLayout from "../components/layouts/MainLayouts/OrganizerLayout";
import AttendeeLayout from "../components/layouts/MainLayouts/AttendeeLayout";
import AttendeeHomePage from "../pages/attendee/AttendeeHomePage";
import LoginPage from "../pages/guest/LoginPage";
import RegisterPage from "../pages/guest/RegisterPage";
import { getOrganizerRoutes } from "./OrganizerRoutes";
import { getAttendeeRoutes } from "./AttendeeRoutes";
import ProtectedRoute from "./ProtectedRoute";
import EventDetailPage from "../pages/attendee/EventDetailPage";


const publicRoutes = [
  {
    path: "/",
    element: <AttendeeHomePage />,
    handle: { public: true },
  },
  {
    path: "/event/:eventId",
    element: <EventDetailPage />,
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
    path: "/attendee",
    element: (
      <ProtectedRoute allowedRoles={["attendee"]}>
        <AttendeeLayout />
      </ProtectedRoute>
    ),
    handle: { requiresAuth: true, allowedRoles: ["attendee"] },
    children: [
      ...getAttendeeRoutes()
    ]
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

export default router;
