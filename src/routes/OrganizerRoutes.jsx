import OrganizerLayout from "../components/layouts/MainLayouts/OrganizerLayout";
import HomePage from "../pages/organizer/Home/Home";
import PrivateRoute from "./PrivateRoute";
import { Route } from "react-router-dom";


const organizerRoutes = [
   { path: '/organizer/home', element: <HomePage /> },
//    { path: '/organizer/dashboard', element: <OrganizerDashboard />},
//    { path: '/organizer/events/create', element: <OrganizerCreateEvent />},
]

export function OrganizerRoutes() {
    return (organizerRoutes.map((path, element) => (
        <Route 
        key={path} 
        path={path} 
        element={
            <PrivateRoute >
                <OrganizerLayout>
                    {element}
                </OrganizerLayout>
            </PrivateRoute>
        } />)
    
    )

    )

}

