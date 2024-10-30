import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import AdminNavBar from "./AdminNavBar";
import {
  LayoutDashboard,
  FileText,
  CreditCard,
  Users,
  Search,
  Download,
} from "lucide-react";

const Reg_User = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/users");
        setUsers(response.data);
      } catch (error) {
        if (error.response) {
          setError(error.response.data.message);
        } else {
          setError("An unexpected error occurred.");
        }
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) =>
    Object.values(user).some((value) =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <div className="w-64 bg-gray-600 text-white">
          {/* Navigation */}
          <AdminNavBar />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Registered Users
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage and view all registered users in the system
          </p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Search and Actions Bar */}
        <div className="mb-6 flex justify-between items-center">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search users..."
              className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </button>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Mobile Number
                  </th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    PAN Number
                  </th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Service Type
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <td className="py-4 px-6 text-sm text-gray-900 dark:text-gray-200">
                      {user.name}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-900 dark:text-gray-200">
                      {user.email}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-900 dark:text-gray-200">
                      {user.mobileNumber}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-900 dark:text-gray-200">
                      {user.panNumber}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-900 dark:text-gray-200">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {user.serviceType}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reg_User;
