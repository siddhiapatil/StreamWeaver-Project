import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

import {
  FaHome,
  FaCloudUploadAlt,
  FaDatabase,
  FaChartBar,
  FaHistory,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";

import "../styles/Sidebar.css";

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("streamweaverUserEmail");
    localStorage.removeItem("streamweaverLoggedIn");

    navigate("/");
  };

  return (
    <aside className="sidebar">

      {/* LOGO */}
      <div className="sidebar-logo">
        <h1>StreamWeaver</h1>
      </div>

      {/* NAVIGATION */}
      <nav className="sidebar-navigation">

        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? "active" : ""}`
          }
        >
          <FaHome />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/upload"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? "active" : ""}`
          }
        >
          <FaCloudUploadAlt />
          <span>Upload Dataset</span>
        </NavLink>

        <NavLink
          to="/pipelines"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? "active" : ""}`
          }
        >
          <FaDatabase />
          <span>Pipelines</span>
        </NavLink>

        <NavLink
          to="/analytics"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? "active" : ""}`
          }
        >
          <FaChartBar />
          <span>Analytics</span>
        </NavLink>

        <NavLink
          to="/history"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? "active" : ""}`
          }
        >
          <FaHistory />
          <span>History</span>
        </NavLink>

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? "active" : ""}`
          }
        >
          <FaCog />
          <span>Settings</span>
        </NavLink>

      </nav>

      {/* LOGOUT */}
      <button
        className="sidebar-logout"
        onClick={handleLogout}
      >
        <FaSignOutAlt />
        <span>Logout</span>
      </button>

    </aside>
  );
}

export default Sidebar;