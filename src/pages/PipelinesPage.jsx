import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Pipelines.css";
const API_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

function PipelinesPage() {
  // -----------------------------
  // Pipeline details
  // -----------------------------

  const [pipelineName, setPipelineName] = useState("");
  const [description, setDescription] = useState("");

  // -----------------------------
  // Source
  // -----------------------------

  const [source, setSource] = useState({
    dataset: "",
    fileType: "",
  });

  // -----------------------------
  // Transformation
  // -----------------------------

  const [transformation, setTransformation] = useState({
    type: "",
    column: "",
  });

  // -----------------------------
  // Destination
  // -----------------------------

  const [destination, setDestination] = useState({
    type: "",
    collection: "",
  });

  // -----------------------------
  // Uploaded datasets
  // -----------------------------

  const [datasets, setDatasets] = useState([]);

  // -----------------------------
  // Existing pipelines
  // -----------------------------

  const [pipelines, setPipelines] = useState([]);

  // -----------------------------
  // UI states
  // -----------------------------

  const [loading, setLoading] = useState(false);
  const [fetchingPipelines, setFetchingPipelines] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // =========================================================
  // Load uploaded datasets from localStorage
  // =========================================================

  useEffect(() => {
    loadDatasets();
    fetchPipelines();
  }, []);

  const loadDatasets = () => {
    try {
      const savedDatasets =
        JSON.parse(localStorage.getItem("streamweaverDatasets")) || [];

      setDatasets(savedDatasets);
    } catch (error) {
      console.error("Error loading datasets:", error);
      setDatasets([]);
    }
  };

  // =========================================================
  // Get existing pipelines from backend
  // =========================================================

  const fetchPipelines = async () => {
    try {
      setFetchingPipelines(true);

      const response = await axios.get(`${API_URL}/pipelines`);

      if (response.data.success) {
        setPipelines(response.data.pipelines || []);
      }
    } catch (error) {
      console.error("Unable to fetch pipelines:", error);
    } finally {
      setFetchingPipelines(false);
    }
  };

  // =========================================================
  // Handle dataset selection
  // =========================================================

  const handleDatasetChange = (e) => {
    const selectedDataset = e.target.value;

    let fileType = "";

    if (selectedDataset.toLowerCase().endsWith(".csv")) {
      fileType = "csv";
    } else if (selectedDataset.toLowerCase().endsWith(".json")) {
      fileType = "json";
    }

    setSource({
      dataset: selectedDataset,
      fileType: fileType,
    });
  };

  // =========================================================
  // Handle transformation
  // =========================================================

  const handleTransformationChange = (e) => {
    setTransformation({
      ...transformation,
      type: e.target.value,
    });
  };

  // =========================================================
  // Validation
  // =========================================================

  const validatePipeline = () => {
    setError("");
    setMessage("");

    if (!pipelineName.trim()) {
      setError("Please enter a pipeline name.");
      return false;
    }

    if (!source.dataset) {
      setError("Please select a source dataset.");
      return false;
    }

    if (!source.fileType) {
      setError("Please select a valid CSV or JSON dataset.");
      return false;
    }

    if (!transformation.type) {
      setError("Please select a transformation.");
      return false;
    }

    if (
      transformation.type !== "remove-null" &&
      !transformation.column.trim()
    ) {
      setError("Please enter the column name for the transformation.");
      return false;
    }

    if (!destination.type) {
      setError("Please select a destination.");
      return false;
    }

    if (!destination.collection.trim()) {
      setError("Please enter a destination collection name.");
      return false;
    }

    return true;
  };

  // =========================================================
  // Create pipeline
  // =========================================================

  const createPipeline = async () => {
    if (!validatePipeline()) {
      return;
    }

    const pipelineData = {
      name: pipelineName.trim(),
      description: description.trim(),

      source: {
        dataset: source.dataset,
        fileType: source.fileType,
      },

      transformation: {
        type: transformation.type,
        column: transformation.column.trim(),
      },

      destination: {
        type: destination.type,
        collection: destination.collection.trim(),
      },
    };

    try {
      setLoading(true);
      setError("");
      setMessage("");

      const response = await axios.post(
        `${API_URL}/pipelines`,
        pipelineData
      );

      if (response.data.success) {
        setMessage("Pipeline created successfully!");

        // Refresh pipeline list
        fetchPipelines();

        // Clear form
        setPipelineName("");
        setDescription("");

        setSource({
          dataset: "",
          fileType: "",
        });

        setTransformation({
          type: "",
          column: "",
        });

        setDestination({
          type: "",
          collection: "",
        });
      }
    } catch (error) {
      console.error("Pipeline creation error:", error);

      if (error.response) {
        setError(
          error.response.data.message ||
            "Failed to create pipeline."
        );
      } else {
        setError(
          "Unable to connect to backend. Make sure the server is running."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // Delete pipeline
  // =========================================================

  const deletePipeline = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this pipeline?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/pipelines/${id}`);

      setMessage("Pipeline deleted successfully.");

      fetchPipelines();
    } catch (error) {
      console.error("Delete pipeline error:", error);

      setError("Failed to delete pipeline.");
    }
  };

  // =========================================================
  // Reset form
  // =========================================================

  const resetForm = () => {
    setPipelineName("");
    setDescription("");

    setSource({
      dataset: "",
      fileType: "",
    });

    setTransformation({
      type: "",
      column: "",
    });

    setDestination({
      type: "",
      collection: "",
    });

    setError("");
    setMessage("");
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="pipelines-page">

      {/* ==============================================
          PAGE HEADER
      ============================================== */}

      <div className="pipeline-page-header">
        <div>
          <h1>Pipeline Builder</h1>

          <p>
            Create and configure your StreamWeaver ETL pipeline
          </p>
        </div>
      </div>

      {/* ==============================================
          SUCCESS MESSAGE
      ============================================== */}

      {message && (
        <div className="success-message">
          ✓ {message}
        </div>
      )}

      {/* ==============================================
          ERROR MESSAGE
      ============================================== */}

      {error && (
        <div className="error-message">
          ⚠ {error}
        </div>
      )}

      {/* ==============================================
          PIPELINE DETAILS
      ============================================== */}

      <div className="pipeline-card">

        <div className="section-title">
          <span className="section-number">1</span>

          <div>
            <h2>Pipeline Details</h2>
            <p>Give your pipeline a name and description.</p>
          </div>
        </div>

        <div className="form-grid">

          <div className="form-field">
            <label>
              Pipeline Name <span>*</span>
            </label>

            <input
              type="text"
              value={pipelineName}
              onChange={(e) =>
                setPipelineName(e.target.value)
              }
              placeholder="Example: Customer Data Pipeline"
            />
          </div>

          <div className="form-field">
            <label>Description</label>

            <input
              type="text"
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              placeholder="Describe what this pipeline does"
            />
          </div>

        </div>
      </div>

      {/* ==============================================
          PIPELINE FLOW
      ============================================== */}

      <div className="pipeline-flow">

        {/* SOURCE */}

        <div className="flow-node source-node">

          <div className="flow-icon">
            📁
          </div>

          <div>
            <span>STEP 2</span>
            <h3>Source</h3>
            <p>
              Select the dataset that will enter
              the pipeline.
            </p>
          </div>

        </div>

        <div className="flow-arrow">
          →
        </div>

        {/* TRANSFORMATION */}

        <div className="flow-node transform-node">

          <div className="flow-icon">
            ⚙️
          </div>

          <div>
            <span>STEP 3</span>
            <h3>Transformation</h3>
            <p>
              Select how the data should be
              transformed.
            </p>
          </div>

        </div>

        <div className="flow-arrow">
          →
        </div>

        {/* DESTINATION */}

        <div className="flow-node destination-node">

          <div className="flow-icon">
            🗄️
          </div>

          <div>
            <span>STEP 4</span>
            <h3>Destination</h3>
            <p>
              Select where the processed data
              will be stored.
            </p>
          </div>

        </div>

      </div>

      {/* ==============================================
          SOURCE CONFIGURATION
      ============================================== */}

      <div className="pipeline-card">

        <div className="section-title">

          <span className="section-number">
            2
          </span>

          <div>
            <h2>Source Configuration</h2>

            <p>
              Select an uploaded CSV or JSON dataset.
            </p>
          </div>

        </div>

        <div className="form-grid">

          <div className="form-field">

            <label>
              Dataset <span>*</span>
            </label>

            <select
              value={source.dataset}
              onChange={handleDatasetChange}
            >

              <option value="">
                Select uploaded dataset
              </option>

              {datasets.map((dataset, index) => {

                const datasetName =
                  typeof dataset === "string"
                    ? dataset
                    : dataset.name ||
                      dataset.fileName ||
                      `Dataset ${index + 1}`;

                return (
                  <option
                    key={index}
                    value={datasetName}
                  >
                    {datasetName}
                  </option>
                );
              })}

            </select>

            {datasets.length === 0 && (
              <small className="helper-text">
                No uploaded datasets found.
                Upload a CSV or JSON file first.
              </small>
            )}

          </div>

          <div className="form-field">

            <label>File Type</label>

            <input
              type="text"
              value={
                source.fileType
                  ? source.fileType.toUpperCase()
                  : ""
              }
              placeholder="Automatically detected"
              readOnly
            />

          </div>

        </div>

      </div>

      {/* ==============================================
          TRANSFORMATION CONFIGURATION
      ============================================== */}

      <div className="pipeline-card">

        <div className="section-title">

          <span className="section-number">
            3
          </span>

          <div>
            <h2>Transformation Configuration</h2>

            <p>
              Choose the operation to apply to your data.
            </p>
          </div>

        </div>

        <div className="form-grid">

          <div className="form-field">

            <label>
              Transformation Type <span>*</span>
            </label>

            <select
              value={transformation.type}
              onChange={handleTransformationChange}
            >

              <option value="">
                Select transformation
              </option>

              <option value="uppercase">
                Convert to Uppercase
              </option>

              <option value="lowercase">
                Convert to Lowercase
              </option>

              <option value="trim">
                Trim Spaces
              </option>

              <option value="remove-null">
                Remove Null Values
              </option>

            </select>

          </div>

          <div className="form-field">

            <label>
              Column Name
              {transformation.type !== "remove-null" && (
                <span> *</span>
              )}
            </label>

            <input
              type="text"
              value={transformation.column}
              onChange={(e) =>
                setTransformation({
                  ...transformation,
                  column: e.target.value,
                })
              }
              placeholder="Example: customer_name"
              disabled={
                transformation.type === "remove-null"
              }
            />

            <small className="helper-text">
              Enter the column on which the transformation
              should be applied.
            </small>

          </div>

        </div>

      </div>

      {/* ==============================================
          DESTINATION CONFIGURATION
      ============================================== */}

      <div className="pipeline-card">

        <div className="section-title">

          <span className="section-number">
            4
          </span>

          <div>
            <h2>Destination Configuration</h2>

            <p>
              Configure where your processed data will go.
            </p>
          </div>

        </div>

        <div className="form-grid">

          <div className="form-field">

            <label>
              Destination Type <span>*</span>
            </label>

            <select
              value={destination.type}
              onChange={(e) =>
                setDestination({
                  ...destination,
                  type: e.target.value,
                })
              }
            >

              <option value="">
                Select destination
              </option>

              <option value="mongodb">
                MongoDB
              </option>

            </select>

          </div>

          <div className="form-field">

            <label>
              Collection Name <span>*</span>
            </label>

            <input
              type="text"
              value={destination.collection}
              onChange={(e) =>
                setDestination({
                  ...destination,
                  collection: e.target.value,
                })
              }
              placeholder="Example: processed_customers"
            />

          </div>

        </div>

      </div>

      {/* ==============================================
          PIPELINE PREVIEW
      ============================================== */}

      <div className="pipeline-card preview-card">

        <div className="section-title">

          <span className="section-number">
            5
          </span>

          <div>
            <h2>Pipeline Preview</h2>

            <p>
              Review your pipeline before creating it.
            </p>
          </div>

        </div>

        <div className="preview-flow">

          <div className="preview-box">
            <strong>📁 Source</strong>

            <span>
              {source.dataset || "Not selected"}
            </span>
          </div>

          <div className="preview-arrow">
            →
          </div>

          <div className="preview-box">
            <strong>⚙️ Transform</strong>

            <span>
              {transformation.type
                ? transformation.type
                : "Not selected"}
            </span>
          </div>

          <div className="preview-arrow">
            →
          </div>

          <div className="preview-box">
            <strong>🗄️ Destination</strong>

            <span>
              {destination.collection ||
                "Not selected"}
            </span>
          </div>

        </div>

      </div>

      {/* ==============================================
          ACTION BUTTONS
      ============================================== */}

      <div className="pipeline-actions">

        <button
          className="reset-btn"
          onClick={resetForm}
          disabled={loading}
        >
          Reset
        </button>

        <button
          className="create-pipeline-btn"
          onClick={createPipeline}
          disabled={loading}
        >
          {loading
            ? "Creating Pipeline..."
            : "Create Pipeline"}
        </button>

      </div>

      {/* ==============================================
          EXISTING PIPELINES
      ============================================== */}

      <div className="pipeline-card existing-pipelines">

        <div className="section-title">

          <div>
            <h2>Existing Pipelines</h2>

            <p>
              Pipelines that have already been created.
            </p>
          </div>

        </div>

        {fetchingPipelines ? (
          <div className="empty-state">
            Loading pipelines...
          </div>
        ) : pipelines.length === 0 ? (
          <div className="empty-state">
            No pipelines created yet.
          </div>
        ) : (
          <div className="pipeline-list">

            {pipelines.map((pipeline) => (

              <div
                className="pipeline-list-item"
                key={pipeline._id}
              >

                <div>

                  <h3>
                    {pipeline.name}
                  </h3>

                  <p>
                    {pipeline.description ||
                      "No description"}
                  </p>

                  <div className="pipeline-meta">

                    <span>
                      Source:{" "}
                      {pipeline.source?.dataset ||
                        "N/A"}
                    </span>

                    <span>
                      Transform:{" "}
                      {pipeline.transformation?.type ||
                        "N/A"}
                    </span>

                    <span>
                      Destination:{" "}
                      {pipeline.destination?.type ||
                        "N/A"}
                    </span>

                  </div>

                </div>

                <button
                  className="delete-btn"
                  onClick={() =>
                    deletePipeline(pipeline._id)
                  }
                >
                  Delete
                </button>

              </div>

            ))}

          </div>
        )}

      </div>

    </div>
  );
}

export default PipelinesPage;