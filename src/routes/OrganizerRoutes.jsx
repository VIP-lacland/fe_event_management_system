// src/routes/OrganizerRoutes.jsx
import HomePage from "../pages/organizer/home/Home";
import Dashboard from "../pages/organizer/dashboard/Dashboard";
import CreateEventForm from "../pages/organizer/event/CreateEventForm";
import EditEventPage  from "../pages/organizer/event/EditEventPage";
import EventListPage  from "../pages/organizer/event/EventListPage";
import AttendeeManagementPage from "../pages/organizer/AttendeeManagementPage";
import PendingRegistrationsPage from "../pages/organizer/PendingRegistrationsPage";

export function getOrganizerRoutes() {
  return [
    {
      path: "home",
      Component: HomePage,
    },
    {
      path: "dashboard",
      Component: Dashboard,
    },
    {
      path: "events",
      Component: EventListPage,
    },
    {
      path: "create",
      Component: CreateEventForm,
    },
    {
      path: "events/:eventId/edit",
      Component: EditEventPage,
    },
    {
      path: "events/:eventId/attendees",
      Component: AttendeeManagementPage,
    },
    {
      path: "pending-registrations",
      Component: PendingRegistrationsPage,
    },
  ];
}
