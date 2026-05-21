// src/routes/AppRoutes.jsx
import { createBrowserRouter, Navigate } from "react-router-dom";
import OrganizerLayout from "../components/layouts/MainLayouts/OrganizerLayout";
import HomePage from "../pages/attendee/HomePage";
import LoginPage from "../pages/guest/LoginPage";
// import CreateEventForm from "../pages/organizer/event/CreateEventForm";
// import { EditEventPage } from "../pages/EditEventPage";
import { getOrganizerRoutes } from "./OrganizerRoutes";
import ProtectedRoute from "./ProtectedRoute";
import EventDetailPage from "../pages/attendee/EventDetailPage";
import EventRegistrationPage from "../pages/attendee/EventRegistrationPage";
import ProfilePage from "../pages/attendee/ProfilePage";
import MyTicketsPage from "../pages/attendee/MyTicketsPage";
import DashboardPage from "../pages/attendee/DashboardPage";

const publicRoutes = [
  {
    path: "/",
    element: <HomePage />,
    handle: { public: true },
  },
  {
    path: "/event/:eventId",
    element: <EventDetailPage />,
    handle: { public: true },
  },
  {
    path: "/event/:eventId/register",
    element: (
      <ProtectedRoute allowedRoles={["attendee"]}>
        <EventRegistrationPage />
      </ProtectedRoute>
    ),
    handle: { requiresAuth: true, allowedRoles: ["attendee"] },
  },
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <ProfilePage />
      </ProtectedRoute>
    ),
    handle: { requiresAuth: true },
  },
  {
    path: "/my-tickets",
    element: (
      <ProtectedRoute>
        <MyTicketsPage />
      </ProtectedRoute>
    ),
    handle: { requiresAuth: true },
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    ),
    handle: { requiresAuth: true },
  },
  {
    path: "/login",
    element: <LoginPage />,
    handle: { public: true },
  },
  {
    path: "/register",
    element: <LoginPage />,
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
