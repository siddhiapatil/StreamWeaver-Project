






# 🌊 StreamWeaver: High-Throughput No-Code ETL Pipeline

StreamWeaver is a web-based **No-Code ETL (Extract, Transform, Load) platform** designed to simplify the processing of large CSV and JSON datasets through a visual interface.

The frontend provides an interactive interface for dataset upload, pipeline configuration, transformation setup, execution monitoring, analytics, and history management.

---

## 🏗️ Frontend Architecture

```text
                    User
                     │
                     ▼
              ┌──────────────┐
              │   React UI   │
              └──────┬───────┘
                     │
              React Router
                     │
        ┌────────────┼────────────┐
        ▼            ▼            ▼
     Dashboard     Upload      Pipelines
        │            │            │
        └────────────┼────────────┘
                     │
                   Axios
                     │
                     ▼
              Express Backend
             
The frontend is organized into reusable components and page-level modules.

Main Frontend Modules
Login – User login interface and validation.
Dashboard – Overview of datasets, pipelines and activities.
Dataset Upload – CSV/JSON file selection, validation and upload status.
Pipeline Builder – Configure Source, Transformation and Destination.
Analytics – Display pipeline and execution metrics.
History – View previous pipeline executions.
Settings – Application and user configuration.
📁 Project Structure
streamweaver-client/
├── public/
├── src/
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
🚀 Frontend Features
🔐 Login
Login form
Input validation
Error handling
Navigation to dashboard
📊 Dashboard
Dataset overview
Pipeline overview
Processing activity
Pipeline status
Recent operations
📁 Dataset Upload
CSV and JSON file support
File type validation
File selection
Upload status
Progress feedback
Dataset information
🔄 Pipeline Builder

The Pipeline Builder represents the ETL workflow:

Source
   ↓
Transformation
   ↓
Destination
Source
Dataset selection
Source configuration
Dataset information
Transformation
Transformation configuration
Field mapping
Transformation rules

Example:

shravani
    ↓
uppercase()
    ↓
SHRAVANI
Destination
Destination configuration
Output configuration
📈 Analytics

Displays pipeline activity including:

Total pipelines
Executions
Successful executions
Failed executions
Records processed
Processing duration
🕘 History

Displays previous pipeline executions including:

Pipeline name
Execution status
Records processed
Processing duration
Execution date
🧭 Navigation

Reusable navigation components:

Dashboard
Datasets
Pipelines
Analytics
History
Settings
🛠️ Technology Stack
Technology	Purpose
React.js	Frontend UI
JavaScript ES6+	Application logic
CSS3	Styling
React Router	Client-side navigation
Axios	API communication
React Icons	UI icons
React Virtualized	Large-data rendering
🔗 Backend Integration

The frontend communicates with the Node.js/Express backend using REST APIs.

React
  ↓
Axios
  ↓
Express API
  ↓
ETL Engine

The frontend prepares structured pipeline configuration containing:

Source
+
Transformation
+
Destination
        ↓
Pipeline Configuration
⚡ Large Dataset UI Strategy

StreamWeaver uses React Virtualized to efficiently display large datasets.

Instead of rendering every row:

Large Dataset
      ↓
React Virtualized
      ↓
Visible Rows
      ↓
Better UI Performance

This reduces unnecessary DOM rendering and improves browser responsiveness.

📅 Development Progress
Week 1 — Frontend Foundation
React application setup
Login page
Dashboard
Navbar
Sidebar
React Router navigation
Dataset Upload interface
CSV/JSON validation
Upload progress UI
UI styling and debugging
Week 2 — Pipeline Builder
Pipeline Builder interface
Source configuration
Transformation configuration
Destination configuration
Field mapping
Pipeline creation workflow
Axios/API integration
Navigation improvements
UI refinement and debugging
👩‍💻 My Role
Akiti Shravani

Frontend Developer — StreamWeaver

Responsibilities
Designed and developed React frontend
Created Login and Dashboard interfaces
Developed reusable Navbar and Sidebar components
Implemented React Router navigation
Developed Dataset Upload interface
Added CSV/JSON validation
Implemented upload progress UI
Developed Pipeline Builder
Added Source, Transformation and Destination sections
Developed pipeline configuration forms
Integrated frontend with backend APIs
Tested pipeline creation workflow
Debugged navigation and UI issues
Improved layouts and styling
Prepared frontend for complete ETL integration
📚 Key Learnings
React component architecture
React Router
Axios API integration
File upload handling
Form handling
ETL workflow design
REST API communication
React Virtualized
Frontend debugging
Responsive UI development
Git and GitHub workflow
Frontend-backend integration
🚀 Future Enhancements
Drag-and-drop pipeline builder
Real-time pipeline monitoring
Advanced data validation
Interactive analytics
Row-level error reporting
Pipeline scheduling
Real-time notifications
Additional data sources and destinations
Cloud deployment
▶️ Setup & Execution
Prerequisites
Node.js
npm
Installation
git clone https://github.com/siddhiapatil/StreamWeaver-Project.git
cd StreamWeaver-Project
cd streamweaver-client
npm install
Start Frontend
npm start

The frontend will normally run at:

http://localhost:3000
🌊 StreamWeaver
Build → Transform → Process → Analyze

StreamWeaver combines a visual React interface with a scalable Node.js ETL architecture to make large-scale data processing simpler and more accessible.

👩‍💻 Developed By

Akiti Shravani

Role: Frontend Developer