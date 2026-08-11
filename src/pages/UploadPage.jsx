import "../styles/Upload.css";

import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

import {
  FaCloudUploadAlt,
  FaFileCsv,
  FaFileCode,
  FaCheckCircle,
  FaTimes,
} from "react-icons/fa";

function UploadPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // -----------------------------
  // STATES
  // -----------------------------
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploaded, setUploaded] = useState(false);

  // -----------------------------
  // HANDLE FILE
  // -----------------------------
  const handleFile = (file) => {
    if (!file) return;

    const fileName = file.name.toLowerCase();

    const isCSV = fileName.endsWith(".csv");
    const isJSON = fileName.endsWith(".json");

    if (!isCSV && !isJSON) {
      alert("Please select a CSV or JSON file.");
      return;
    }

    setSelectedFile(file);
    setUploaded(false);
    setUploading(false);
    setProgress(0);
  };

  // -----------------------------
  // FILE INPUT
  // -----------------------------
  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (file) {
      handleFile(file);
    }
  };

  // -----------------------------
  // DRAG OVER
  // -----------------------------
  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  // -----------------------------
  // DRAG LEAVE
  // -----------------------------
  const handleDragLeave = (event) => {
    event.preventDefault();
    setIsDragging(false);
  };

  // -----------------------------
  // DROP
  // -----------------------------
  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files?.[0];

    if (file) {
      handleFile(file);
    }
  };

  // -----------------------------
  // SELECT FILE BUTTON
  // -----------------------------
  const openFileSelector = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // -----------------------------
  // START UPLOAD
  // -----------------------------
  const startUpload = () => {
    if (!selectedFile) {
      alert("Please select a CSV or JSON file first.");
      return;
    }

    setUploading(true);
    setUploaded(false);
    setProgress(0);

    let currentProgress = 0;

    const interval = setInterval(() => {
      currentProgress += 10;

      setProgress(currentProgress);

      if (currentProgress >= 100) {
        clearInterval(interval);

        // -----------------------------
        // CREATE DATASET OBJECT
        // -----------------------------
        const dataset = {
          id: Date.now(),
          name: selectedFile.name,
          size: selectedFile.size,
          type: selectedFile.name
            .toLowerCase()
            .endsWith(".csv")
            ? "CSV"
            : "JSON",
          uploadedAt: new Date().toLocaleString(),
          status: "Uploaded",
        };

        // -----------------------------
        // GET EXISTING DATASETS
        // -----------------------------
        const existingDatasets = JSON.parse(
          localStorage.getItem("streamweaverDatasets") || "[]"
        );

        // -----------------------------
        // ADD NEW DATASET
        // -----------------------------
        existingDatasets.push(dataset);

        // -----------------------------
        // SAVE DATASETS
        // -----------------------------
        localStorage.setItem(
          "streamweaverDatasets",
          JSON.stringify(existingDatasets)
        );

        // Save the most recently uploaded dataset
        localStorage.setItem(
          "streamweaverSelectedDataset",
          JSON.stringify(dataset)
        );

        // Small delay before success message
        setTimeout(() => {
          setUploading(false);
          setUploaded(true);
        }, 500);
      }
    }, 150);
  };

  // -----------------------------
  // REMOVE FILE
  // -----------------------------
  const removeFile = () => {
    setSelectedFile(null);
    setUploading(false);
    setUploaded(false);
    setProgress(0);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // -----------------------------
  // CREATE PIPELINE
  // -----------------------------
  const createPipeline = () => {
    if (!selectedFile) {
      alert("Please upload a dataset first.");
      return;
    }

    // Save selected dataset before moving
    const dataset = {
      id: Date.now(),
      name: selectedFile.name,
      size: selectedFile.size,
      type: selectedFile.name
        .toLowerCase()
        .endsWith(".csv")
        ? "CSV"
        : "JSON",
      status: "Uploaded",
    };

    localStorage.setItem(
      "streamweaverSelectedDataset",
      JSON.stringify(dataset)
    );

    // Navigate to pipelines
    navigate("/pipelines");
  };

  // -----------------------------
  // FILE SIZE
  // -----------------------------
  const getFileSize = (size) => {
    if (size < 1024) {
      return `${size} Bytes`;
    }

    if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(2)} KB`;
    }

    return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  };

  // -----------------------------
  // RENDER
  // -----------------------------
  return (
    <div className="app-layout">

      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN CONTENT */}
      <div className="main-content">

        {/* NAVBAR */}
        <Navbar />

        {/* UPLOAD PAGE */}
        <div className="upload-page">

          {/* HEADER */}
          <div className="upload-page-header">

            <div>
              <h1>Upload Dataset</h1>

              <p>
                Upload large CSV or JSON datasets to StreamWeaver.
              </p>
            </div>

            <button
              className="back-btn"
              onClick={() => navigate("/dashboard")}
            >
              Back to Dashboard
            </button>

          </div>

          {/* DROP ZONE */}
          <div
            className={`upload-drop-zone ${
              isDragging ? "dragging" : ""
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >

            <FaCloudUploadAlt className="large-upload-icon" />

            <h2>
              Drag & Drop your dataset here
            </h2>

            <p>
              or select a file from your computer
            </p>

            <button
              type="button"
              className="select-file-btn"
              onClick={openFileSelector}
            >
              Select File
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.json"
              onChange={handleFileChange}
              hidden
            />

            <span className="supported-text">
              Supported formats: CSV, JSON
            </span>

          </div>

          {/* SELECTED FILE */}
          {selectedFile && (
            <div className="selected-file-card">

              <div className="file-information">

                {selectedFile.name
                  .toLowerCase()
                  .endsWith(".csv") ? (
                  <FaFileCsv className="file-type-icon" />
                ) : (
                  <FaFileCode className="file-type-icon" />
                )}

                <div>
                  <h3>{selectedFile.name}</h3>

                  <p>
                    {getFileSize(selectedFile.size)}
                  </p>
                </div>

              </div>

              {!uploading && !uploaded && (
                <button
                  type="button"
                  className="remove-file-btn"
                  onClick={removeFile}
                  title="Remove file"
                >
                  <FaTimes />
                </button>
              )}

            </div>
          )}

          {/* UPLOAD ACTION */}
          {selectedFile && !uploaded && (
            <div className="upload-action-card">

              {/* PROGRESS */}
              {uploading && (
                <div className="upload-progress">

                  <div className="progress-header">

                    <span>
                      Uploading dataset...
                    </span>

                    <span>
                      {progress}%
                    </span>

                  </div>

                  <div className="upload-progress-bar">

                    <div
                      className="upload-progress-value"
                      style={{
                        width: `${progress}%`,
                      }}
                    ></div>

                  </div>

                </div>
              )}

              {/* UPLOAD BUTTON */}
              <button
                type="button"
                className="upload-submit-btn"
                onClick={startUpload}
                disabled={uploading}
              >
                {uploading
                  ? `Processing ${progress}%`
                  : "Upload Dataset"}
              </button>

            </div>
          )}

          {/* SUCCESS MESSAGE */}
          {uploaded && selectedFile && (
            <div className="success-card">

              <FaCheckCircle className="success-icon" />

              <div className="success-information">

                <h3>
                  Dataset uploaded successfully!
                </h3>

                <p>
                  {selectedFile.name} is ready for
                  pipeline processing.
                </p>

              </div>

              <button
                type="button"
                onClick={createPipeline}
              >
                Create Pipeline
              </button>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default UploadPage;