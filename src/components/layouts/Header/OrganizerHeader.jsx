import { NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../store/authStore";
import "./OrganizerHeader.css";

export default function OrganizerHeader() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const navItems = [
    { path: "/organizer/dashboard", label: "Dashboard" },
    { path: "/organizer/events", label: "Events" },
    { path: "/organizer/create", label: "Create Event" },
  ];

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <>
      <header className="organizer-header">
        <div className="header-container">
          <div className="header-brand">
            <NavLink to="/organizer/dashboard" className="brand-link"></NavLink>
          </div>
          <nav className="header-nav">
            {navItems.map((item) => (
              <NavLink
                to={item.path}
                end
                className={({ isActive }) =>
                  `nav-link ${isActive ? "nav-link-active" : ""}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="header-user">
            <span className="user-name">{user?.name || "Organizer"}</span>
            <button onClick={handleLogout} className="logout-btn">
              Đăng xuất
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
