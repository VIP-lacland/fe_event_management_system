// src/routes/AppRoutes.jsx
import { createBrowserRouter, Navigate } from "react-router-dom";
import OrganizerLayout from "../components/layouts/MainLayouts/OrganizerLayout";
import AttendeeLayout from "../components/layouts/MainLayouts/AttendeeLayout";
import AttendeeHomePage from "../pages/attendee/AttendeeHomePage";
import LoginPage from "../pages/guest/LoginPage";
// import CreateEventForm from "../pages/organizer/event/CreateEventForm";
// import { EditEventPage } from "../pages/EditEventPage";
import { getOrganizerRoutes } from "./OrganizerRoutes";
import { getAttendeeRoutes } from "./AttendeeRoutes";
// import EventListPage from "../Routes";
import ProtectedRoute from "./ProtectedRoute";
import EventDetailPage from "../pages/attendee/EventDetailPage";
// import EventRegistrationPage from "../pages/attendee/EventRegistrationPage";
// import ProfilePage from "../pages/attendee/ProfilePage";
// import MyTicketsPage from "../pages/attendee/MyTicketsPage";

const publicRoutes = [
  {
    path: "/",
    element: <AttendeeHomePage />,
    handle: { public: true },
  },
  // {
  //   path: "/event/:eventId/register",
  //   element: (
  //     <ProtectedRoute allowedRoles={["attendee"]}>
  //       <EventRegistrationPage />
  //     </ProtectedRoute>
  //   ),
  //   handle: { requiresAuth: true, allowedRoles: ["attendee"] },
  // },
  // {
  //   path: "/profile",
  //   element: (
  //     <ProtectedRoute>
  //       <ProfilePage />
  //     </ProtectedRoute>
  //   ),
  //   handle: { requiresAuth: true },
  // },
  // {
  //   path: "/my-tickets",
  //   element: (
  //     <ProtectedRoute>
  //       <MyTicketsPage />
  //     </ProtectedRoute>
  //   ),
  //   handle: { requiresAuth: true },
  // },
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
  {
    path: "/event/:eventId",
    element: <EventDetailPage />,
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
      // {
      //   index: true,
      //   element: <Navigate to="home" replace />,
      // },
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
