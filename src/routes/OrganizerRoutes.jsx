// src/routes/OrganizerRoutes.jsx
import HomePage from "../pages/organizer/Home/Home";
import Dashboard from "../pages/organizer/Dashboard/Dashboard";
import CreateEventForm from "../pages/organizer/Event/CreateEventForm";
import EditEventPage  from "../pages/organizer/Event/EditEventPage";


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
      path: "create",
      Component: CreateEventForm,
    },
    {
      path: "events/:eventId/edit",
      Component: EditEventPage,
    },
  ];
}
