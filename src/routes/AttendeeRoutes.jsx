import AttendeeHomePage from "../pages/attendee/AttendeeHomePage";
import EventRegistrationPage from "../pages/attendee/EventRegistrationPage";
import ProfilePage from "../pages/attendee/ProfilePage";
import MyTicketsPage from "../pages/attendee/MyTicketsPage";


export function getAttendeeRoutes() {
    return [
        {
            path: "home",
            Component: AttendeeHomePage,
        },
        {
            path: "event/:eventId/register",
            Component: EventRegistrationPage,
        },
        {
            path: "profile",
            Component: ProfilePage,
        },
        {
            path: "my-tickets",
            Component: MyTicketsPage,
        },
        {
            path: "profile",
            Component: ProfilePage,
        }
    ]
}