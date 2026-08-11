import "../styles/Pipelines.css";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

import {
  FaDatabase,
  FaArrowRight,
  FaPlay,
  FaTrash,
} from "react-icons/fa";

function PipelinesPage() {
  const navigate = useNavigate();

  const [dataset, setDataset] = useState(null);
  const [pipelineName, setPipelineName] = useState("");
  const [source, setSource] = useState("Uploaded Dataset");
  const [transform, setTransform] = useState("None");
  const [destination, setDestination] = useState("MongoDB");
  const [created, setCreated] = useState(false);

  useEffect(() => {
    const savedDataset = localStorage.getItem(
      "streamweaverSelectedDataset"
    );

    if (savedDataset) {
      setDataset(JSON.parse(savedDataset));
    }
  }, []);

  const handleCreatePipeline = () => {
    if (!dataset) {
      alert("Please upload a dataset first.");
      navigate("/upload");
      return;
    }

    if (!pipelineName.trim()) {
      alert("Please enter a pipeline name.");
      return;
    }

    const pipeline = {
      id: Date.now(),
      name: pipelineName,
      dataset: dataset.name,
      source,
      transform,
      destination,
      status: "Ready",
      createdAt: new Date().toLocaleString(),
    };

    const existingPipelines = JSON.parse(
      localStorage.getItem("streamweaverPipelines") || "[]"
    );

    existingPipelines.push(pipeline);

    localStorage.setItem(
      "streamweaverPipelines",
      JSON.stringify(existingPipelines)
    );

    setCreated(true);
  };

  const clearDataset = () => {
    localStorage.removeItem(
      "streamweaverSelectedDataset"
    );

    setDataset(null);
  };

  return (
    <div className="app-layout">

      <Sidebar />

      <div className="main-content">

        <Navbar />

        <div className="pipeline-page">

          {/* HEADER */}
          <div className="pipeline-header">

            <div>
              <h1>Pipelines</h1>

              <p>
                Create and manage your ETL pipelines.
              </p>
            </div>

            <button
              className="back-btn"
              onClick={() => navigate("/dashboard")}
            >
              Back to Dashboard
            </button>

          </div>

          {/* DATASET */}
          <div className="pipeline-card">

            <h2>
              <FaDatabase />
              Dataset
            </h2>

            {dataset ? (
              <div className="dataset-info">

                <div>
                  <strong>
                    {dataset.name}
                  </strong>

                  <p>
                    Type: {dataset.type}
                  </p>

                  <p>
                    Status: {dataset.status}
                  </p>
                </div>

                <button
                  className="remove-dataset-btn"
                  onClick={clearDataset}
                >
                  <FaTrash />
                </button>

              </div>
            ) : (
              <div className="no-dataset">

                <p>
                  No dataset selected.
                </p>

                <button
                  onClick={() => navigate("/upload")}
                >
                  Upload Dataset
                </button>

              </div>
            )}

          </div>

          {/* PIPELINE CONFIGURATION */}
          {dataset && !created && (
            <div className="pipeline-card">

              <h2>
                Create New Pipeline
              </h2>

              {/* PIPELINE NAME */}
              <div className="form-group">

                <label>
                  Pipeline Name
                </label>

                <input
                  type="text"
                  placeholder="Enter pipeline name"
                  value={pipelineName}
                  onChange={(e) =>
                    setPipelineName(e.target.value)
                  }
                />

              </div>

              {/* SOURCE */}
              <div className="form-group">

                <label>
                  Source
                </label>

                <select
                  value={source}
                  onChange={(e) =>
                    setSource(e.target.value)
                  }
                >
                  <option>
                    Uploaded Dataset
                  </option>

                  <option>
                    CSV File
                  </option>

                  <option>
                    JSON File
                  </option>
                </select>

              </div>

              {/* TRANSFORMATION */}
              <div className="form-group">

                <label>
                  Transformation
                </label>

                <select
                  value={transform}
                  onChange={(e) =>
                    setTransform(e.target.value)
                  }
                >

                  <option value="None">
                    None
                  </option>

                  <option value="Capitalize">
                    Capitalize Text
                  </option>

                  <option value="Remove Empty Rows">
                    Remove Empty Rows
                  </option>

                  <option value="Remove Duplicates">
                    Remove Duplicates
                  </option>

                </select>

              </div>

              {/* DESTINATION */}
              <div className="form-group">

                <label>
                  Destination
                </label>

                <select
                  value={destination}
                  onChange={(e) =>
                    setDestination(e.target.value)
                  }
                >

                  <option value="MongoDB">
                    MongoDB
                  </option>

                  <option value="MySQL">
                    MySQL
                  </option>

                  <option value="CSV">
                    CSV
                  </option>

                </select>

              </div>

              {/* CREATE */}
              <button
                className="create-pipeline-btn"
                onClick={handleCreatePipeline}
              >
                Create Pipeline
                <FaArrowRight />
              </button>

            </div>
          )}

          {/* SUCCESS */}
          {created && (
            <div className="pipeline-success">

              <h2>
                Pipeline Created Successfully!
              </h2>

              <p>
                Your pipeline is ready to run.
              </p>

              <div className="pipeline-flow">

                <span>
                  {dataset.name}
                </span>

                <FaArrowRight />

                <span>
                  {transform}
                </span>

                <FaArrowRight />

                <span>
                  {destination}
                </span>

              </div>

              <button
                className="run-pipeline-btn"
                onClick={() =>
                  alert(
                    "Pipeline execution will be connected to the backend later."
                  )
                }
              >
                <FaPlay />
                Run Pipeline
              </button>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}

export default PipelinesPage;