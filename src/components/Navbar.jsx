import React from "react";
import {
  FaSearch,
  FaBell,
  FaUserCircle,
} from "react-icons/fa";

import "../styles/Navbar.css";

function Navbar() {
  const storedEmail =
    localStorage.getItem("streamweaverUserEmail");

  let userName = "User";

  if (storedEmail) {
    const namePart = storedEmail.split("@")[0];

    userName = namePart
      .replace(/[._-]/g, " ")
      .split(" ")
      .filter(Boolean)
      .map(
        (word) =>
          word.charAt(0).toUpperCase() +
          word.slice(1).toLowerCase()
      )
      .join(" ");
  }

  return (
    <header className="navbar">

      {/* BRAND */}
      <div className="navbar-left">

        <div className="navbar-brand">

          <div className="brand-icon">
            SW
          </div>

          <div className="brand-text">
            <h2>StreamWeaver</h2>
            <span>ETL Platform</span>
          </div>

        </div>

      </div>

      {/* SEARCH */}
      <div className="navbar-search">

        <FaSearch className="search-icon" />

        <input
          type="text"
          placeholder="Search pipelines, datasets..."
        />

      </div>

      {/* RIGHT */}
      <div className="navbar-right">

        <button
          className="notification-btn"
          type="button"
          title="Notifications"
        >
          <FaBell />

          <span className="notification-dot"></span>
        </button>

        <div className="navbar-divider"></div>

        <div className="navbar-user">

          <div className="user-avatar">
            <FaUserCircle />
          </div>

          <div className="user-details">

            <strong>
              {userName}
            </strong>

            <span>
              Data Engineer
            </span>

          </div>

        </div>

      </div>

    </header>
  );
}

export default Navbar;