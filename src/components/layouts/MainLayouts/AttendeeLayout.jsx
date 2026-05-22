// src/components/layouts/MainLayouts/OrganizerLayout.jsx
import { Outlet } from "react-router-dom";
import AttendeeHeader from "../../layouts/Header/AttendeeHeader";


export default function AttendeeLayout() {
  return (
    <div className="attendee-app">
      <AttendeeHeader />
      <main className="attendee-main">
        <Outlet />
      </main>
    </div>
  );
}