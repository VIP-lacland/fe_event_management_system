// src/routes/OrganizerRoutes.jsx
import OrganizerHomePage from "../pages/organizer/home/OrganizerHome";
import Dashboard from "../pages/organizer/dashboard/Dashboard";
import CreateEventForm from "../pages/organizer/event/CreateEventForm";
import EditEventPage from "../pages/organizer/event/EditEventPage";
import EventListPage from "../pages/organizer/event/EventListPage";
import AttendeeManagementPage from "../pages/organizer/attendeeManagement/AttendeeManagementPage";
import PendingRegistrationsPage from "../pages/organizer/attendeeManagement/PendingRegistrationsPage";

export function getOrganizerRoutes() {
  return [
    {
      path: "home",
      Component: OrganizerHomePage,
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
