import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

function Header() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const userName = localStorage.getItem("user") || "Admin";
  const fullName = localStorage.getItem("fullName") || "Admin User";

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("fullName");
    navigate("/");
  };

  return (
    <div className="top-navbar">
      <div className="navbar-brand">
        <div className="brand-icon">R</div>
        <span>RoboDeliver</span>
      </div>

      <div className="nav-links">
        <Link
          to="/dashboard"
          className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
        >
          <span style={{ fontSize: '1.2rem' }}>📈</span> Monitoring
        </Link>
        <Link
          to="/navigation"
          className={`nav-link ${location.pathname === '/navigation' ? 'active' : ''}`}
        >
          <span style={{ fontSize: '1.2rem' }}>🗺️</span> Navigation
        </Link>
      </div>

      <div className="user-dropdown-container" ref={dropdownRef}>
        <div
          className="user-avatar"
          onClick={() => setDropdownOpen(!dropdownOpen)}
          title={fullName}
        >
          {getInitials(fullName)}
        </div>

        {dropdownOpen && (
          <div className="user-dropdown-menu">
            <div className="user-dropdown-header">
              <div className="user-dropdown-name">{fullName}</div>
              <div className="user-dropdown-username">@{userName}</div>
            </div>
            <div className="user-dropdown-item">
              <span className="user-dropdown-label">Password</span>
              <span>••••••••</span>
            </div>
            <div className="user-dropdown-item">
              <span className="user-dropdown-label">Current Delivery</span>
              <span>Laptop Package</span>
            </div>
            <div className="user-dropdown-divider"></div>
            <button
              id="logout-btn"
              className="user-dropdown-logout-btn"
              onClick={handleLogout}
            >
              <span>🚪</span> Log Out
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;