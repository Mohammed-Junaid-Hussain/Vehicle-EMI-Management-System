import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminNavBar from "./Components/AdminNavBar";

function Admin_Home() {
  const [adminInfo, setAdminInfo] = useState({
    email: "",
    totalRegisteredUsers: 0,
    newLoanApps: 0,
    approvedLoanApps: 0,
    rejectedLoanApps: 0,
    disbursedLoanApps: 0,
  });
  const [metrics, setMetrics] = useState([
    { title: "Total Reg Users", count: 0, ref: "/admin/Reg_User" },
    { title: "New Loan Application", count: 0, ref: "/admin/LoanRequestAdmin" },
    {
      title: "Approved Loan Application",
      count: 0,
      ref: "/admin/LoanRequestAdmin",
    },
    {
      title: "Rejected Loan Application",
      count: 0,
      ref: "/admin/LoanRequestAdmin",
    },
    {
      title: "Disbursed Loan Application",
      count: 0,
      ref: "/admin/LoanRequestAdmin",
    },
  ]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchAdminDetails = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/admin-details/1"
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Admin data:", data);

        setAdminInfo(data);
        setMetrics((prevMetrics) =>
          prevMetrics.map((metric) => {
            if (metric.title === "Total Reg Users") {
              return { ...metric, count: data.totalRegisteredUsers || 0 };
            } else if (metric.title === "New Loan Application") {
              return { ...metric, count: data.newLoanApps || 0 };
            } else if (metric.title === "Approved Loan Application") {
              return { ...metric, count: data.approvedLoanApps || 0 };
            } else if (metric.title === "Rejected Loan Application") {
              return { ...metric, count: data.rejectedLoanApps || 0 };
            } else if (metric.title === "Disbursed Loan Application") {
              return { ...metric, count: data.disbursedLoanApps || 0 };
            }
            return metric;
          }) 
        );
      } catch (error) {
        console.error("Error fetching admin details:", error);
        setErrorMessage("Failed to fetch admin details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAdminDetails();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-64 bg-gray-600 text-white">
        <AdminNavBar />
      </div>
      <div className="flex-1 p-8">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Hi, welcome back! Admin
        </h2>

        {loading ? (
          <p className="text-gray-600 dark:text-gray-400 mt-1">Loading...</p>
        ) : (
          <>
            {errorMessage && (
              <div className="text-red-500 mb-4">{errorMessage}</div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
              {metrics.map((metric, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                >
                  <h3 className="text-gray-600 dark:text-gray-300 mb-2">
                    {metric.title}
                  </h3>
                  <p className="text-2xl font-semibold mb-2 text-gray-900 dark:text-gray-200">
                    {metric.count}
                  </p>
                  <Link
                    to={metric.ref}
                    className="text-gray-500 dark:text-gray-400 hover:text-gray-900"
                  >
                    View Detail
                  </Link>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Admin_Home;
