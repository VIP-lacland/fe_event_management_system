// src/components/layouts/MainLayouts/OrganizerLayout.jsx
import { Outlet } from "react-router-dom";
// import OrganizerHeader from "../../organizer/Header/OrganizerHeader";
import OrganizerHeader from "../../layouts/Header/OrganizerHeader";


export default function OrganizerLayout() {
  return (
    <div className="organizer-app">
      <OrganizerHeader />
      <main className="organizer-main">
        {console.log('🔌 Outlet rendering')}
        <Outlet />
      </main>
    </div>
  );
}