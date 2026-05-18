// src/routes/OrganizerRoutes.jsx
import HomePage from "../pages/organizer/Home/Home";
import Dashboard from "../pages/organizer/Dashboard/Dashboard";
import CreateEventForm from "../pages/organizer/Event/CreateEventForm";
import EditEventPage  from "../pages/organizer/Event/EditEventPage";
import EventListPage  from "../pages/organizer/Event/EventListPage";


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
  ];
}

