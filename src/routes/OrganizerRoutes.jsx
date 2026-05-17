import HomePage from "../pages/organizer/Home/Home";
import Dashboard from "../pages/organizer/Dashboard/Dashboard";

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
  ];
}
