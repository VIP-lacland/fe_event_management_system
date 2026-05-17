// // src/routes/AttendeeRoutes.jsx
// import { Navigate } from "react-router-dom";
// import PrivateRoute from "./PrivateRoute";

// // Attendee Pages (tạo sau)
// // import HomePage from "../pages/attendee/Home/Home";

// const attendeeRouteConfigs = [
//   { 
//     path: 'home', 
//     element: <div>Attendee Home Page</div>,
//     handle: { 
//       title: 'Home', 
//       requiresAuth: true, 
//       role: 'attendee' 
//     }
//   },
// ];

// export function getAttendeeRoutes() {
//   return [
//     {
//       path: '',
//       element: <Navigate to="home" replace />,
//       handle: { public: true }
//     },
//     {
//       element: (
//         <PrivateRoute role="attendee">
//           <div className="attendee-layout">
//             <main><Outlet /></main>
//           </div>
//         </PrivateRoute>
//       ),
//       handle: { requiresAuth: true, role: 'attendee' },
//       children: [
//         ...attendeeRouteConfigs.map((config) => ({
//           ...config,
//           path: config.path.replace(/^\//, ''),
//         })),
//         {
//           path: '*',
//           element: <Navigate to="home" replace />,
//           handle: { public: true }
//         }
//       ]
//     }
//   ];
// }