import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../store/authStore";

// Header layout component for the attendee homepage
// Bao gồm logo và điều hướng chính của ứng dụng
const Header = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuthStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="homepage-topbar">
      <Link
        to="/"
        className="homepage-brand"
        style={{ textDecoration: "none" }}
      >
        Eventify
      </Link>
      <nav className="homepage-nav" aria-label="Main navigation">
        <div className="homepage-nav-group">
          <button className="homepage-button" type="button" onClick={() => navigate("/")}>
            Home
          </button>
          <button className="homepage-button" type="button">
            About Us
          </button>
          <button className="homepage-button" type="button">
            Contact
          </button>
        </div>

        {isAuthenticated && user ? (
          <div
            className="user-dropdown-container"
            ref={dropdownRef}
            style={{ position: "relative" }}
          >
            <button
              className="homepage-action"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
                padding: "0.35rem 1rem 0.35rem 0.4rem",
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background:
                    "linear-gradient(135deg, #ff2d95 0%, #ff7a00 100%)",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                  boxShadow: "0 2px 4px rgba(255, 122, 0, 0.3)",
                }}
              >
                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>
              <span style={{ fontWeight: 600, color: "#111827" }}>
                {user.name}
              </span>
              <span
                style={{
                  fontSize: "0.7rem",
                  opacity: 0.5,
                  marginLeft: "0.2rem",
                  color: "#111827",
                }}
              >
                ▼
              </span>
            </button>

            {dropdownOpen && (
              <div
                className="user-dropdown-menu"
                style={{
                  position: "absolute",
                  top: "calc(100% + 12px)",
                  right: 0,
                  background: "#fff",
                  borderRadius: "16px",
                  padding: "0.5rem",
                  minWidth: "220px",
                  boxShadow: "0 12px 30px rgba(0,0,0,0.15)",
                  zIndex: 100,
                  border: "1px solid rgba(0,0,0,0.06)",
                }}
              >
                <div
                  style={{
                    padding: "0.75rem",
                    borderBottom: "1px solid #f1f5f9",
                    marginBottom: "0.5rem",
                  }}
                >
                  <div style={{ fontWeight: "bold", color: "#111827" }}>
                    {user.name}
                  </div>
                  <div
                    style={{
                      fontSize: "0.85rem",
                      color: "#64748b",
                      wordBreak: "break-all",
                    }}
                  >
                    {user.email}
                  </div>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "#fff",
                      background: "linear-gradient(90deg, #ff2d95, #ff7a00)",
                      padding: "3px 8px",
                      borderRadius: "999px",
                      display: "inline-block",
                      marginTop: "6px",
                      fontWeight: "bold",
                    }}
                  >
                    {user.role === "organizer" ? "Organizer" : "Attendee"}
                  </div>
                </div>

                {user.role === "organizer" && (
                  <div
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate("/organizer");
                    }}
                    style={{
                      display: "block",
                      padding: "0.6rem 0.75rem",
                      color: "#334155",
                      textDecoration: "none",
                      borderRadius: "8px",
                      transition: "background 0.2s",
                      fontWeight: 500,
                      cursor: "pointer",
                    }}
                    onMouseOver={(e) => (e.target.style.background = "#f8fafc")}
                    onMouseOut={(e) =>
                      (e.target.style.background = "transparent")
                    }
                  >
                    Dashboard
                  </div>
                )}

                <div
                  onClick={() => {
                    setDropdownOpen(false);
                    navigate("/profile");
                  }}
                  style={{
                    display: "block",
                    padding: "0.6rem 0.75rem",
                    color: "#334155",
                    textDecoration: "none",
                    borderRadius: "8px",
                    transition: "background 0.2s",
                    fontWeight: 500,
                    cursor: "pointer",
                  }}
                  onMouseOver={(e) => (e.target.style.background = "#f8fafc")}
                  onMouseOut={(e) =>
                    (e.target.style.background = "transparent")
                  }
                >
                  Profile
                </div>
                <div
                  onClick={() => {
                    setDropdownOpen(false);
                    navigate("/attendee/my-tickets");
                  }}
                  style={{
                    display: "block",
                    padding: "0.6rem 0.75rem",
                    color: "#334155",
                    textDecoration: "none",
                    borderRadius: "8px",
                    transition: "background 0.2s",
                    fontWeight: 500,
                    cursor: "pointer",
                  }}
                  onMouseOver={(e) => (e.target.style.background = "#f8fafc")}
                  onMouseOut={(e) =>
                    (e.target.style.background = "transparent")
                  }
                >
                  My Tickets
                </div>

                <button
                  onClick={handleLogout}
                  style={{
                    display: "block",
                    width: "100%",
                    textAlign: "left",
                    padding: "0.6rem 0.75rem",
                    color: "#ef4444",
                    textDecoration: "none",
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    borderRadius: "8px",
                    transition: "background 0.2s",
                    marginTop: "0.5rem",
                    fontWeight: 600,
                  }}
                  onMouseOver={(e) => (e.target.style.background = "#fef2f2")}
                  onMouseOut={(e) =>
                    (e.target.style.background = "transparent")
                  }
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" className="homepage-action primary">
            Login
          </Link>
        )}
      </nav>
    </header>
  );
};

export default Header;
