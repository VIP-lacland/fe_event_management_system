// src/components/layouts/MainLayouts/OrganizerLayout.jsx
import { Outlet } from "react-router-dom";
import OrganizerHeader from "../../layouts/Header/OrganizerHeader";


export default function OrganizerLayout() {
  return (
    <div className="organizer-app">
      <OrganizerHeader />
      <main className="organizer-main">
        <Outlet />
      </main>
    </div>
  );
}