import Dashboard from "../components/Dashboard";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function DashboardPage() {
  return (
    <div>

      <Sidebar />

      <div className="main-content">

        <Navbar />

        <Dashboard />

      </div>

    </div>
  );
}

export default DashboardPage;