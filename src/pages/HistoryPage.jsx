import "../styles/History.css";
import {
  FaCheckCircle,
  FaClock,
  FaTimesCircle
} from "react-icons/fa";

function HistoryPage() {

  const history = [
    {
      name: "Customer Data Pipeline",
      date: "10 Aug 2026",
      rows: "250,000",
      status: "Completed"
    },
    {
      name: "Sales Data Pipeline",
      date: "09 Aug 2026",
      rows: "120,500",
      status: "Completed"
    },
    {
      name: "Inventory Pipeline",
      date: "08 Aug 2026",
      rows: "85,200",
      status: "Running"
    },
    {
      name: "Marketing Data Pipeline",
      date: "07 Aug 2026",
      rows: "45,600",
      status: "Failed"
    }
  ];

  return (
    <div className="history-page">

      <div className="page-header">
        <div>
          <h1>Pipeline History</h1>
          <p>View your previous ETL pipeline executions.</p>
        </div>
      </div>

      <div className="history-table-container">

        <table className="history-table">

          <thead>
            <tr>
              <th>Pipeline</th>
              <th>Date</th>
              <th>Rows Processed</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>

            {history.map((item, index) => (

              <tr key={index}>

                <td>{item.name}</td>

                <td>{item.date}</td>

                <td>{item.rows}</td>

                <td>

                  {item.status === "Completed" && (
                    <span className="status completed">
                      <FaCheckCircle />
                      Completed
                    </span>
                  )}

                  {item.status === "Running" && (
                    <span className="status running">
                      <FaClock />
                      Running
                    </span>
                  )}

                  {item.status === "Failed" && (
                    <span className="status failed">
                      <FaTimesCircle />
                      Failed
                    </span>
                  )}

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default HistoryPage;