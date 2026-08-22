import React from "react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Dashboard from "../components/Dashboard";

import "../styles/Dashboard.css";

function DashboardPage() {
  return (
    <div className="app-layout">

      {/* LEFT SIDEBAR */}
      <Sidebar />

      {/* RIGHT SIDE */}
      <div className="main-layout">

        {/* TOP NAVBAR */}
        <Navbar />

        {/* DASHBOARD CONTENT */}
        <main className="main-content">
          <Dashboard />
        </main>

      </div>

    </div>
  );
}

export default DashboardPage;