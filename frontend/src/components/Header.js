import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

function Header() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const userName = localStorage.getItem("user") || "Admin";

  const getInitials = (name) => {
    return name.substring(0, 2).toUpperCase();
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

      <div className="user-dropdown-container">
        <div 
          className="user-avatar" 
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          {getInitials(userName)}
        </div>

        {dropdownOpen && (
          <div className="user-dropdown-menu">
            <div className="user-dropdown-header">
              <div className="user-dropdown-name">John Supervisor</div>
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
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;