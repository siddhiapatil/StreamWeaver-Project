import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaFileAlt,
  FaDatabase,
  FaPlay,
  FaCheckCircle,
  FaCloudUploadAlt,
  FaArrowRight,
  FaServer,
} from "react-icons/fa";

import "../styles/Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const [userName, setUserName] = useState("User");
  const [filesUploaded, setFilesUploaded] = useState(0);

  // ==========================================
  // GET USER NAME
  // ==========================================

  useEffect(() => {
    const email = localStorage.getItem("streamweaverUserEmail");

    if (email) {
      const namePart = email.split("@")[0];

      const formattedName = namePart
        .replace(/[._-]/g, " ")
        .split(" ")
        .filter(Boolean)
        .map(
          (word) =>
            word.charAt(0).toUpperCase() +
            word.slice(1).toLowerCase()
        )
        .join(" ");

      setUserName(formattedName || "User");
    }

    loadDatasets();
  }, []);

  // ==========================================
  // LOAD DATASETS
  // ==========================================

  const loadDatasets = () => {
    try {
      const storedDatasets =
        JSON.parse(
          localStorage.getItem("streamweaverDatasets")
        ) || [];

      setFilesUploaded(storedDatasets.length);
    } catch (error) {
      console.error("Unable to load datasets:", error);
      setFilesUploaded(0);
    }
  };

  // ==========================================
  // GO TO UPLOAD
  // ==========================================

  const handleUpload = () => {
    navigate("/upload");
  };

  // ==========================================
  // GO TO PIPELINES
  // ==========================================

  const handlePipelines = () => {
    navigate("/pipelines");
  };

  return (
    <div className="dashboard-container">

      {/* =====================================
          HEADER
      ====================================== */}

      <div className="dashboard-header">

        <div className="dashboard-title">

          <h1>
            Welcome Back, {userName} 👋
          </h1>

          <p>
            Monitor your ETL pipelines and upload
            large datasets.
          </p>

        </div>

        <button
          className="dashboard-upload-btn"
          onClick={handleUpload}
        >
          <FaCloudUploadAlt />
          Upload New Dataset
        </button>

      </div>


      {/* =====================================
          STATISTICS
      ====================================== */}

      <div className="dashboard-stats">

        {/* FILES */}

        <div className="stat-card">

          <div className="stat-icon">
            <FaFileAlt />
          </div>

          <div>
            <h2>{filesUploaded}</h2>
            <p>Files Uploaded</p>
          </div>

        </div>


        {/* ROWS */}

        <div className="stat-card">

          <div className="stat-icon">
            <FaDatabase />
          </div>

          <div>
            <h2>15.8 M</h2>
            <p>Rows Processed</p>
          </div>

        </div>


        {/* RUNNING */}

        <div className="stat-card">

          <div className="stat-icon">
            <FaPlay />
          </div>

          <div>
            <h2>3</h2>
            <p>Running Jobs</p>
          </div>

        </div>


        {/* COMPLETED */}

        <div className="stat-card">

          <div className="stat-icon">
            <FaCheckCircle />
          </div>

          <div>
            <h2>21</h2>
            <p>Completed Jobs</p>
          </div>

        </div>

      </div>


      {/* =====================================
          LOWER GRID
      ====================================== */}

      <div className="dashboard-grid">

        {/* ===================================
            UPLOAD DATASET CARD
        ==================================== */}

        <div className="dashboard-upload-card">

          <div className="dashboard-upload-icon">
            <FaCloudUploadAlt />
          </div>

          <h2>
            Upload Dataset
          </h2>

          <p>
            Upload your CSV or JSON dataset
            and start building an ETL pipeline.
          </p>

          <button
            className="dashboard-select-btn"
            onClick={handleUpload}
          >
            Select File
            <FaArrowRight />
          </button>

        </div>


        {/* ===================================
            QUICK PIPELINE CARD
        ==================================== */}

        <div className="system-status">

          <div className="system-status-header">

            <div>
              <h2>Pipeline Workspace</h2>

              <p>
                Build and manage your ETL pipelines.
              </p>
            </div>

            <FaServer />
          </div>


          <div className="status-row">

            <span>
              Uploaded Datasets
            </span>

            <strong>
              {filesUploaded}
            </strong>

          </div>


          <div className="status-row">

            <span>
              Pipeline Engine
            </span>

            <span className="status-healthy">
              Ready
            </span>

          </div>


          <div className="status-row">

            <span>
              Processing
            </span>

            <span className="status-online">
              Available
            </span>

          </div>


          <button
            className="pipeline-dashboard-btn"
            onClick={handlePipelines}
          >
            Open Pipeline Builder
            <FaArrowRight />
          </button>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;