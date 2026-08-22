# StreamWeaver-Project
# 🌊 StreamWeaver

### No-Code ETL Platform for Large-Scale Data Processing

<p align="center">
  <img src="https://img.shields.io/badge/React.js-Frontend-61DAFB?style=flat-square&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=flat-square&logo=javascript&logoColor=black" />
  <img src="https://img.shields.io/badge/CSS3-Styling-1572B6?style=flat-square&logo=css3&logoColor=white" />
  <img src="https://img.shields.io/badge/Node.js-Backend-339933?style=flat-square&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Express.js-API-000000?style=flat-square&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-Database-47A248?style=flat-square&logo=mongodb&logoColor=white" />
</p>

---

## ✨ What is StreamWeaver?

**StreamWeaver** is a web-based ETL platform that helps users work with large datasets through a simple visual interface.

The goal is to make data processing easier by allowing users to:

* 📂 Upload datasets
* 🔗 Configure data pipelines
* 🧩 Apply transformations
* ▶️ Execute pipelines
* 📊 Monitor results
* 📈 Analyze pipeline activity
* 🕘 Review execution history

Instead of requiring users to manually interact with backend processing logic, StreamWeaver provides a centralized interface for managing the complete ETL workflow.

---

## 🖥️ Frontend Experience

The frontend is built with **React.js** and focuses on providing a clean and simple experience for managing ETL workflows.

### Main Screens

```text
┌──────────────────────────────────────────┐
│              STREAMWEAVER                │
├──────────────┬───────────────────────────┤
│              │                           │
│  Dashboard   │       Dashboard           │
│              │                           │
│  Datasets    │    ┌────┐ ┌────┐ ┌────┐  │
│              │    │Data│ │Pipe│ │Jobs│  │
│  Pipelines   │    └────┘ └────┘ └────┘  │
│              │                           │
│  Analytics   │      Recent Activity      │
│              │                           │
│  History     │                           │
│              │                           │
│  Settings    │                           │
│              │                           │
└──────────────┴───────────────────────────┘
```

---

# 🎨 Frontend Features

### 🔐 Authentication

The application includes dedicated authentication interfaces for users.

**Implemented:**

* Login page
* Registration page
* Form inputs
* Validation
* Authentication navigation
* User-friendly error states

---

### 📊 Dashboard

The dashboard acts as the main control center of the application.

Users can quickly view:

* Total datasets
* Pipeline information
* Processing activity
* Recent operations
* Pipeline status

---

### 📁 Dataset Management

The frontend provides an interface for handling datasets.

Users can:

* Select files
* Upload datasets
* View upload progress
* Validate supported file types
* Track uploaded datasets

Supported formats include:

```text
CSV
JSON
```

---

# 🔄 Pipeline Management

The **Pipeline section** is one of the core parts of the frontend.

Users can create and manage their ETL workflows through the UI.

### Pipeline Workflow

```text
Dataset
   │
   ▼
Select Source
   │
   ▼
Configure Transformation
   │
   ▼
Apply Rules
   │
   ▼
Choose Destination
   │
   ▼
Run Pipeline
   │
   ▼
View Result
```

### Pipeline UI supports

* Pipeline creation
* Dataset selection
* Transformation configuration
* Pipeline execution
* Pipeline status
* Pipeline management

---

# 📈 Analytics

The Analytics section provides a visual overview of pipeline activity.

Users can monitor information such as:

| Metric     | Purpose                     |
| ---------- | --------------------------- |
| Pipelines  | Number of created pipelines |
| Executions | Number of pipeline runs     |
| Success    | Successfully completed runs |
| Failed     | Failed executions           |
| Records    | Data processed              |
| Duration   | Processing time             |

---

# 🕘 Execution History

The History page provides a record of previously executed operations.

Users can review:

* Pipeline name
* Execution status
* Number of records
* Execution time
* Date/time
* Processing results

This makes it easier to track previous ETL operations.

---

# 🧭 Navigation

The application uses a centralized navigation system.

### Sidebar

Provides access to:

```text
Dashboard
Datasets
Pipelines
Analytics
History
Settings
```

### Navbar

Provides:

* Search
* Notifications
* User information
* Application controls

---

# 🛠️ Technology Stack

## Frontend

| Technology      | Usage             |
| --------------- | ----------------- |
| ⚛️ React.js     | UI development    |
| 🟨 JavaScript   | Application logic |
| 🎨 CSS3         | Interface styling |
| 🔗 Axios        | API communication |
| 🧭 React Router | Navigation        |
| 🎯 React Icons  | UI icons          |

## Backend

| Technology      | Usage                 |
| --------------- | --------------------- |
| 🟢 Node.js      | Server runtime        |
| ⚫ Express.js    | REST API              |
| 🍃 MongoDB      | Data storage          |
| 🌊 Node Streams | Large file processing |

---

# 🧱 Application Structure

```text
StreamWeaver
│
├── Frontend
│   │
│   ├── Components
│   │   ├── Dashboard
│   │   ├── Login
│   │   ├── Navbar
│   │   └── Sidebar
│   │
│   ├── Pages
│   │   ├── Dashboard
│   │   ├── Pipelines
│   │   ├── Analytics
│   │   └── Register
│   │
│   └── Styles
│       ├── Dashboard
│       ├── Login
│       ├── Navbar
│       ├── Pipelines
│       ├── Register
│       └── Sidebar
│
└── Backend
    │
    ├── Routes
    ├── Controllers
    ├── Services
    ├── ETL
    └── Middleware
```

---

# 🔌 Frontend ↔ Backend

The React application communicates with the backend through REST APIs.

```text
             USER
              │
              ▼
       ┌─────────────┐
       │ React UI    │
       └──────┬──────┘
              │
           Axios
              │
              ▼
       ┌─────────────┐
       │ Express API │
       └──────┬──────┘
              │
              ▼
       ┌─────────────┐
       │ ETL Engine  │
       └──────┬──────┘
              │
              ▼
       ┌─────────────┐
       │ Data Store  │
       └─────────────┘
```

---

# ⚡ Why StreamWeaver?

Traditional data processing can become difficult when datasets grow.

StreamWeaver addresses this by combining:

**Simple UI + Stream Processing + Configurable Pipelines**

```text
Easy to use
     +
Large dataset support
     +
Visual pipeline management
     =
       🌊 StreamWeaver
```

---

# 🚀 Running the Frontend

Clone the project and enter the frontend directory:

```bash
git clone <repository-url>

cd streamweaver-client
```

Install dependencies:

```bash
npm install
```

Start the React application:

```bash
npm start
```

The application will normally be available at:

```text
http://localhost:3000
```

---

# 📌 Development Highlights

### Frontend Development

The frontend implementation focuses on:

* Component-based React development
* Reusable UI components
* Page-based application structure
* Client-side navigation
* Responsive layouts
* Consistent styling
* API integration
* Pipeline management interfaces
* User interaction handling

---

# 👩‍💻 Frontend Developer

## Akiti Shravani

**Role:** Frontend Developer

### Contributions

* Built React-based application interfaces
* Developed Dashboard UI
* Developed Pipeline management UI
* Created Login and Registration interfaces
* Implemented Sidebar navigation
* Implemented Navbar
* Developed Analytics interface
* Developed History-related UI
* Created responsive CSS layouts
* Integrated frontend components with backend services
* Improved navigation and user interaction
* Worked on pipeline creation and management functionality

---

# 🌱 Future Improvements

Possible future enhancements include:

* 🔐 Complete authentication integration
* ⚡ Real-time pipeline status
* 📊 Interactive analytics charts
* 🧩 Drag-and-drop pipeline builder
* 📱 Improved mobile responsiveness
* 🔔 Real-time notifications
* ☁️ Cloud deployment
* 👥 Team-based pipeline management

---

## 🌊 StreamWeaver

<p align="center">

**Simplifying ETL workflows through a modern web interface.**

<br>

`Build → Transform → Process → Analyze`

</p>

---

### 👩‍💻 Developed by

**Akiti Shravani — Frontend Developer**

</writing>

