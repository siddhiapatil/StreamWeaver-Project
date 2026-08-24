# # 🌊 StreamWeaver

## High-Throughput No-Code ETL Pipeline

StreamWeaver is a web-based **No-Code ETL (Extract, Transform, Load) platform** designed to simplify the processing of large CSV and JSON datasets through a visual interface.

The platform is designed around a memory-efficient ETL architecture where large datasets can be processed incrementally instead of loading the complete file into memory.

The goal is to provide a simple workflow:

```text
Upload → Configure → Transform → Process → Store → Monitor
```

---

# 🎯 Problem Statement

Processing very large datasets through traditional web applications can create memory and performance problems.

For example, loading a 5GB CSV file completely into memory can result in:

```text
Large File
    ↓
Entire file loaded into memory
    ↓
High RAM usage
    ↓
Slow processing
    ↓
Browser / Node.js memory pressure
    ↓
Possible application failure
```

StreamWeaver addresses this problem by designing the ETL workflow around:

* Streaming file processing
* Incremental transformation
* Virtualized data rendering
* Secure user-defined transformations
* Batch database operations

---

# 💡 Proposed Solution

StreamWeaver provides a visual interface through which users can:

1. Upload a CSV or JSON dataset
2. Select and configure a data source
3. Map source fields to destination fields
4. Configure transformations
5. Select a destination
6. Execute the pipeline
7. Monitor processing
8. Review execution history
9. Analyze pipeline activity

The overall workflow is:

```text
                USER
                  │
                  ▼
          ┌───────────────┐
          │   React UI    │
          └───────┬───────┘
                  │
                Axios
                  │
                  ▼
          ┌───────────────┐
          │ Express API   │
          └───────┬───────┘
                  │
                  ▼
          ┌───────────────┐
          │  ETL Engine   │
          └───────┬───────┘
                  │
        ┌─────────┼─────────┐
        │         │         │
        ▼         ▼         ▼
     Extract   Transform   Load
        │         │         │
        │     isolated-vm   │
        │                   │
        └─────────┬─────────┘
                  │
                  ▼
              MongoDB
```

---

# 🏗️ Architecture

## Frontend

The frontend is built using React.js and provides the visual interface for configuring and managing ETL pipelines.

```text
React Application
│
├── Authentication
├── Dashboard
├── Dataset Upload
├── Pipeline Builder
├── Analytics
├── History
└── Settings
```

## Backend

The backend is designed using Node.js and Express.js.

```text
React
  │
  │ REST API
  ▼
Express.js
  │
  ▼
Node.js
  │
  ├── File Streams
  ├── ETL Processing
  ├── Transformation
  └── Database Operations
  │
  ▼
MongoDB
```

---

# 🖥️ Frontend Features

## 🔐 Login

The application provides a dedicated login interface for users.

The frontend includes:

* Login form
* Input handling
* Validation
* Error-state UI
* Authentication navigation

---

# 📊 Dashboard

The Dashboard acts as the main control center of StreamWeaver.

It provides an overview of:

* Datasets
* Pipelines
* Processing activity
* Pipeline status
* Recent operations

The dashboard is designed to give users a quick understanding of their ETL activity.

---

# 📁 Dataset Upload

The dataset module provides the user interface for uploading data files.

Currently supported formats:

```text
CSV
JSON
```

The upload interface includes:

* File selection
* File type validation
* Upload state
* Progress feedback
* Dataset information

The frontend upload interface is designed to integrate with the backend streaming upload pipeline.

---

# 🔄 Pipeline Builder

The Pipeline Builder is the core frontend module of StreamWeaver.

It represents the ETL workflow visually:

```text
Source
   ↓
Transformation
   ↓
Destination
```

## Source

The Source section represents where the dataset originates.

Users can configure the source dataset and related source information.

## Transformation

The Transformation section represents the data-processing stage.

Example:

```text
Source Column
     │
     ▼
Transformation Rule
     │
     ▼
Destination Column
```

Example transformation:

```text
shravani
    ↓
uppercase()
    ↓
SHRAVANI
```

## Destination

The Destination section represents where the processed data is stored.

The target architecture uses MongoDB for data storage.

---

# 📈 Analytics

The Analytics interface is designed to display pipeline activity such as:

| Metric     | Description                   |
| ---------- | ----------------------------- |
| Pipelines  | Number of pipelines           |
| Executions | Number of pipeline executions |
| Success    | Successful executions         |
| Failed     | Failed executions             |
| Records    | Records processed             |
| Duration   | Processing duration           |

---

# 🕘 Execution History

The History module provides an interface for reviewing previous pipeline executions.

Information can include:

* Pipeline name
* Execution status
* Number of records
* Processing duration
* Execution date
* Result status

---

# 🧭 Navigation

StreamWeaver uses centralized navigation through reusable React components.

### Sidebar

```text
Dashboard
Datasets
Pipelines
Analytics
History
Settings
```

### Navbar

The Navbar provides common application controls such as:

* Search
* Notifications
* User information
* Application controls

---

# 🛠️ Technology Stack

## Frontend

| Technology        | Purpose                        |
| ----------------- | ------------------------------ |
| React.js          | User interface                 |
| JavaScript ES6+   | Application logic              |
| CSS3              | Styling and responsive layouts |
| React Router      | Client-side navigation         |
| Axios             | API communication              |
| React Icons       | Interface icons                |
| React Virtualized | Efficient large-data rendering |

## Backend

| Technology          | Purpose                                                 |
| ------------------- | ------------------------------------------------------- |
| Node.js             | Server runtime                                          |
| Express.js          | REST API framework                                      |
| Node Streams        | Incremental file processing                             |
| MongoDB             | Data storage                                            |
| MongoDB bulkWrite() | Batch database operations                               |
| isolated-vm         | Isolated execution environment for user transformations |

---

# 🚀 Why These Technologies?

## Why React.js?

React provides a component-based architecture that is suitable for a multi-screen interactive application.

Reusable components such as:

```text
Navbar
Sidebar
Forms
Cards
Pipeline Sections
```

can be shared across multiple pages.

---

## Why React Router?

React Router allows the application to navigate between different views without requiring a full browser refresh.

Example:

```text
/login
/dashboard
/upload
/pipelines
/analytics
/history
/settings
```

---

## Why Axios?

Axios provides a clean interface for communicating between the React frontend and Express backend APIs.

```text
React
  ↓
Axios
  ↓
Express API
  ↓
Backend Processing
```

---

## Why Node.js?

Node.js provides asynchronous I/O and native stream APIs, making it suitable for an application focused on large file processing.

---

## Why Express.js?

Express simplifies REST API development and provides routing and middleware support for the Node.js backend.

---

## Why Node Streams?

Node Streams allow large files to be processed incrementally.

Instead of:

```text
5GB file
   ↓
5GB loaded into memory
```

the system can process:

```text
Chunk 1 → Process
Chunk 2 → Process
Chunk 3 → Process
...
```

This is one of the key architectural decisions in StreamWeaver.

---

## Why React Virtualized?

Rendering millions of rows directly in the browser can create a very large DOM and reduce UI performance.

React Virtualized uses virtualization so that only the visible portion of a large dataset needs to be rendered.

```text
Large Dataset
      ↓
Virtualized Grid
      ↓
Visible Rows
      ↓
Better UI Performance
```

---

## Why MongoDB?

MongoDB uses a flexible document-oriented data model that works well with JSON-like ETL output.

Example:

```json
{
  "firstName": "Shravani",
  "department": "CSE",
  "score": 95
}
```

---

## Why bulkWrite()?

Large datasets can contain millions of records.

Performing an individual database operation for every record can create unnecessary overhead.

Batch operations allow multiple records to be written together:

```text
Records
   ↓
Batch
   ↓
bulkWrite()
   ↓
MongoDB
```

This is intended to improve database ingestion efficiency.

---

## Why isolated-vm?

StreamWeaver is designed to support user-defined transformation logic.

For example:

```javascript
return value.toUpperCase();
```

Executing arbitrary user code directly in the main Node.js environment would introduce security risks.

An isolated V8 execution environment is therefore used as part of the architecture for executing transformation code separately from the main server environment.

---

# 📂 Project Structure

The frontend is organized using reusable components, pages and styles.

```text
streamweaver-client/
│
├── public/
│
├── src/
│   │
│   ├── components/
│   │   ├── Navbar.jsx
│   │   └── Sidebar.jsx
│   │
│   ├── pages/
│   │   ├── LoginPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── UploadPage.jsx
│   │   ├── PipelinesPage.jsx
│   │   ├── AnalyticsPage.jsx
│   │   ├── HistoryPage.jsx
│   │   └── SettingsPage.jsx
│   │
│   ├── styles/
│   │   ├── Login.css
│   │   ├── Dashboard.css
│   │   ├── Navbar.css
│   │   ├── Sidebar.css
│   │   └── Pipeline.css
│   │
│   ├── App.js
│   └── index.js
│
├── package.json
└── README.md
```

> File names may vary depending on the current implementation. The important principle is separation between reusable components, pages, styling and application routing.

---

# 📅 Two-Week Development Progress

## Week 1 — Frontend Foundation

### Research and UI Planning

* Studied existing ETL/data-processing applications
* Identified common dashboard and pipeline UI patterns
* Designed initial Login wireframe
* Designed Dashboard wireframe
* Designed Pipeline Builder wireframe

### Frontend Implementation

* Created Login page
* Created Dashboard page
* Created Navbar
* Created Sidebar
* Implemented page navigation
* Created Dataset Upload interface
* Added CSV/JSON validation
* Added upload state and progress UI
* Improved page layouts and styling

### Navigation and Debugging

* Connected pages through React Router
* Fixed navigation issues
* Fixed component import issues
* Improved page-to-page interaction
* Tested the main frontend workflow

---

# 📅 Week 2 — Pipeline Builder

During Week 2, development moved toward the core ETL workflow.

### Pipeline Builder

Implemented the basic Pipeline Builder structure:

```text
Create Pipeline
      ↓
Source
      ↓
Transformation
      ↓
Destination
```

### Source

* Added Source section
* Added source configuration form
* Added dataset-related configuration

### Transformation

* Added Transformation section
* Added transformation configuration form
* Added field mapping concept
* Prepared UI for transformation rules

### Destination

* Added Destination section
* Added destination configuration

### Backend Integration

* Connected frontend pipeline forms with the API layer
* Prepared structured pipeline configuration data
* Tested pipeline creation workflow
* Debugged API and UI issues

### UI Refinement

* Improved layouts
* Fixed design issues
* Improved navigation
* Fixed pipeline-related UI problems
* Refined user interaction

---

# 📊 Current Development Status

## Completed Frontend Work

* [x] Login interface
* [x] Dashboard interface
* [x] Navbar
* [x] Sidebar
* [x] Client-side navigation
* [x] Dataset upload interface
* [x] CSV/JSON validation
* [x] Upload progress UI
* [x] Pipeline Builder base layout
* [x] Source section
* [x] Transformation section
* [x] Destination section
* [x] Source configuration form
* [x] Transformation configuration form
* [x] Frontend API integration work
* [x] Pipeline creation testing
* [x] UI debugging
* [x] Navigation fixes
* [x] Frontend refinement

---

# 🔄 Backend / Integration Roadmap

The complete StreamWeaver architecture is being developed incrementally.

Upcoming integration areas include:

* [ ] Complete large-file streaming
* [ ] Actual streaming upload progress
* [ ] Node.js Transform stream processing
* [ ] CSV/JSON streaming parser
* [ ] Secure transformation execution
* [ ] MongoDB batch ingestion
* [ ] Real-time processing metrics
* [ ] Detailed validation/error reporting
* [ ] Memory and performance profiling

---

# 🗓️ Next Week Development Plan

The next phase will focus on moving from frontend configuration to complete ETL execution.

## 1. Complete API Integration

Connect the Pipeline Builder completely with the backend:

```text
React Form
    ↓
Axios
    ↓
Express API
    ↓
Pipeline Service
```

## 2. Complete Pipeline Creation

Convert the UI configuration into a backend pipeline definition.

```text
Source
+
Transformation
+
Destination
        ↓
Pipeline Configuration
```

## 3. Implement Actual Streaming Processing

Process large files incrementally:

```text
File
 ↓
Node Stream
 ↓
Parser
 ↓
Transform
 ↓
Batch
 ↓
MongoDB
```

## 4. Add Processing Progress

Display:

* Rows processed
* Processing speed
* Current status
* Success/failure state

## 5. Improve Error Handling

Handle:

* Invalid files
* Invalid columns
* API failures
* Transformation failures
* Database failures

## 6. Performance Testing

Measure:

* Memory usage
* Processing speed
* Rows per second
* Browser responsiveness
* Database ingestion performance

---

# 🧪 Example ETL Workflow

A typical StreamWeaver workflow can look like:

```text
Input CSV

first_name,age
shravani,21
rahul,22
```

↓

### Source

```text
CSV Dataset
```

↓

### Transformation

```text
first_name
    ↓
Uppercase
```

↓

### Output

```text
SHRAVANI
RAHUL
```

↓

### Destination

```text
MongoDB
```

---

# 🔐 Security Considerations

User-defined transformations must not execute directly with unrestricted access to the Node.js server environment.

The architecture therefore uses an isolated execution environment for transformation code.

Additional security considerations include:

* Input validation
* File-type validation
* API validation
* Transformation isolation
* Controlled database access
* Error handling

---

# ⚡ Performance Strategy

StreamWeaver focuses on performance at multiple layers.

### File Processing

```text
Node Streams
```

Process data incrementally.

### Browser Rendering

```text
React Virtualized
```

Render only the required visible rows.

### Database

```text
MongoDB bulkWrite()
```

Process records in batches.

### Transformation

```text
isolated-vm
```

Execute user-defined transformations in an isolated environment.

Overall:

```text
Large File
    ↓
Streaming
    ↓
Transformation
    ↓
Batch Processing
    ↓
MongoDB
```

---

# 👩‍💻 My Role — Frontend Developer

## Akiti Shravani

My primary responsibility in StreamWeaver is frontend development.

### Contributions

* Designed and developed React-based application interfaces
* Studied ETL applications and identified UI patterns
* Created Login and Dashboard interfaces
* Developed reusable Navbar and Sidebar components
* Implemented client-side navigation
* Developed Dataset Upload interface
* Added CSV/JSON validation
* Implemented upload progress UI
* Developed Pipeline Builder interface
* Added Source, Transformation and Destination sections
* Developed pipeline configuration forms
* Worked on frontend API integration
* Tested pipeline creation workflow
* Debugged navigation and UI issues
* Improved layouts and styling
* Prepared the frontend for complete backend ETL integration

---

# 📚 Key Learnings

During this development phase, I gained practical experience in:

* React component architecture
* React Router
* Axios API integration
* Form handling
* File upload interfaces
* ETL workflow design
* Large-data UI concepts
* React virtualization
* REST API communication
* Frontend debugging
* Responsive UI development
* Git and GitHub workflow
* Frontend-backend integration

I also gained a better understanding of why streaming and batch processing are important when building systems for large datasets.

---

# 🚀 Future Enhancements

Future versions of StreamWeaver can include:

* Drag-and-drop pipeline builder
* Real-time WebSocket monitoring
* Advanced data validation
* Interactive analytics charts
* Row-level error reporting
* Cloud deployment
* Authentication and role-based access
* Pipeline scheduling
* Real-time notifications
* Team-based pipeline management
* Support for additional data sources and destinations

---

# ▶️ Running the Frontend

Clone the repository and navigate to the frontend:

```bash
git clone <repository-url>
cd streamweaver-client
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm start
```

The application normally runs at:

```text
http://localhost:3000
```

---

# 🌊 StreamWeaver

### Build → Transform → Process → Analyze

StreamWeaver aims to make large-scale ETL processing simpler for non-technical users by combining a visual React interface with a scalable Node.js streaming architecture.

---

## 👩‍💻 Developed By

**Akiti Shravani**

**Role:** Frontend Developer


