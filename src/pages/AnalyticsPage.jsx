import React from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

import "../styles/Analytics.css";

function AnalyticsPage() {
  const navigate = useNavigate();

  return (
    <div className="app-layout">

      <Sidebar />

      <div className="main-content">

        <Navbar />

        <div className="analytics-page">

          {/* HEADER */}
          <div className="analytics-header">

            <div>
              <h1>Analytics</h1>

              <p>
                Monitor your ETL pipeline performance and
                dataset processing statistics.
              </p>
            </div>

            <button
              className="analytics-back-btn"
              onClick={() => navigate("/dashboard")}
            >
              Back to Dashboard
            </button>

          </div>

          {/* STATISTICS */}
          <div className="analytics-stats">

            <div className="analytics-card">
              <h2>15.8 M</h2>
              <p>Total Rows Processed</p>
            </div>

            <div className="analytics-card">
              <h2>3</h2>
              <p>Running Pipelines</p>
            </div>

            <div className="analytics-card">
              <h2>21</h2>
              <p>Completed Jobs</p>
            </div>

            <div className="analytics-card">
              <h2>98.5%</h2>
              <p>Success Rate</p>
            </div>

          </div>

          {/* PIPELINE PERFORMANCE */}
          <div className="analytics-section">

            <h2>Pipeline Performance</h2>

            <div className="analytics-chart-placeholder">

              <div className="chart-bar">
                <span>CSV Processing</span>
                <div className="chart-progress">
                  <div style={{ width: "85%" }}></div>
                </div>
                <strong>85%</strong>
              </div>

              <div className="chart-bar">
                <span>JSON Processing</span>
                <div className="chart-progress">
                  <div style={{ width: "72%" }}></div>
                </div>
                <strong>72%</strong>
              </div>

              <div className="chart-bar">
                <span>Data Transformation</span>
                <div className="chart-progress">
                  <div style={{ width: "91%" }}></div>
                </div>
                <strong>91%</strong>
              </div>

              <div className="chart-bar">
                <span>Database Loading</span>
                <div className="chart-progress">
                  <div style={{ width: "78%" }}></div>
                </div>
                <strong>78%</strong>
              </div>

            </div>

          </div>

          {/* RECENT ACTIVITY */}
          <div className="analytics-section">

            <h2>Recent Processing Activity</h2>

            <div className="analytics-table">

              <div className="analytics-table-header">
                <span>Pipeline</span>
                <span>Dataset</span>
                <span>Rows</span>
                <span>Status</span>
              </div>

              <div className="analytics-table-row">
                <span>Customer ETL</span>
                <span>customers.csv</span>
                <span>125,000</span>
                <span className="status-success">
                  Completed
                </span>
              </div>

              <div className="analytics-table-row">
                <span>Sales ETL</span>
                <span>sales.csv</span>
                <span>350,000</span>
                <span className="status-running">
                  Running
                </span>
              </div>

              <div className="analytics-table-row">
                <span>Orders ETL</span>
                <span>orders.json</span>
                <span>89,500</span>
                <span className="status-success">
                  Completed
                </span>
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default AnalyticsPage;