import React, { useState, useEffect, useMemo } from "react";
import { Loader, Search, X, ChevronDown, ChevronUp } from "lucide-react";
import UserSidebar from "./UserSidebar";

const Badge = ({ children, variant, className = "" }) => {
  const variants = {
    approved: "bg-green-500/10 text-green-500 border-green-500/20",
    pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    rejected: "bg-red-500/10 text-red-500 border-red-500/20",
    ongoing: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    completed: "bg-green-500/10 text-green-500 border-green-500/20",
    defaulted: "bg-red-500/10 text-red-500 border-red-500/20",
  };

  return (
    <span
      className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
        variants[variant] || "bg-gray-500/10 text-gray-500 border-gray-500/20"
      } ${className}`}
    >
      {children}
    </span>
  );
};

const PaymentHistoryPage = () => {
  const [applications, setApplications] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("payment_date");
  const [sortDirection, setSortDirection] = useState("desc");
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [statusFilter, setStatusFilter] = useState(null);
  const [expandedEmiId, setExpandedEmiId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const userId = localStorage.getItem("userId");
    try {
      setLoading(true);
      setError(null);
      const [paymentsRes, applicationsRes] = await Promise.all([
        fetch(`http://localhost:5000/api/loan-payments?userId=${userId}`),
        fetch("http://localhost:5000/api/loan-requests"),
      ]);

      if (!paymentsRes.ok || !applicationsRes.ok) {
        throw new Error("Failed to fetch data");
      }

      const paymentsData = await paymentsRes.json();
      const applicationsData = await applicationsRes.json();

      setPayments(paymentsData);
      setApplications(applicationsData);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load payment history. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const filteredPayments = useMemo(() => {
    return payments
      .filter((payment) => {
        if (!searchTerm) return true;
        const searchTermLower = searchTerm.toLowerCase();
        return (
          payment.payment_id.toString().includes(searchTermLower) ||
          payment.emi_application_id.toString().includes(searchTermLower) ||
          payment.model_name.toLowerCase().includes(searchTermLower) ||
          payment.brand.toLowerCase().includes(searchTermLower)
        );
      })
      .filter((payment) => {
        if (!selectedApplication) return true;
        return payment.emi_application_id === selectedApplication;
      })
      .filter((payment) => {
        if (!statusFilter) return true;
        return payment.emi_status === statusFilter;
      })
      .sort((a, b) => {
        const modifier = sortDirection === "asc" ? 1 : -1;
        return a[sortField] > b[sortField] ? modifier : -modifier;
      });
  }, [payments, searchTerm, selectedApplication, statusFilter, sortField, sortDirection]);

  const paymentsGroupedByEmiId = useMemo(() => {
    return filteredPayments.reduce((groups, payment) => {
      const emiId = payment.emi_application_id;
      if (!groups[emiId]) {
        groups[emiId] = { payments: [], vehicleNames: new Set() };
      }
      groups[emiId].payments.push(payment);
      groups[emiId].vehicleNames.add(`${payment.model_name} (${payment.brand})`);
      return groups;
    }, {});
  }, [filteredPayments]);

  const uniqueStatuses = [...new Set(payments.map(p => p.emi_status))];
  const uniqueApplications = [...new Set(payments.map(p => p.emi_application_id))];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader className="animate-spin w-8 h-8 text-blue-500" />
          <span className="text-xl font-medium">Loading payment history...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-50 flex items-center justify-center">
        <span className="text-xl font-medium text-red-500">{error}</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 flex">
      <UserSidebar />

      <div className="flex-1 py-8 px-6">
        <div className="max-w-7xl mx-auto space-y-8">
          <h1 className="text-4xl font-bold tracking-tight">Payment History</h1>

          {/* Filters */}
          <div className="flex gap-4 items-center bg-slate-800/50 p-4 rounded-lg">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search by payment ID, vehicle model, or brand..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 pl-10 rounded-lg bg-slate-800 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-slate-700/50 transition-colors"
              />
              <Search className="absolute left-3 top-2.5 text-slate-400" size={20} />
            </div>

            <select
              value={selectedApplication || ""}
              onChange={(e) => setSelectedApplication(e.target.value || null)}
              className="px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-slate-700/50 transition-colors min-w-[200px]"
            >
              <option value="">All Applications</option>
              {uniqueApplications.map((appId) => (
                <option key={appId} value={appId}>
                  EMI ID: {appId}
                </option>
              ))}
            </select>

            <select
              value={statusFilter || ""}
              onChange={(e) => setStatusFilter(e.target.value || null)}
              className="px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-slate-700/50 transition-colors min-w-[150px]"
            >
              <option value="">All Statuses</option>
              {uniqueStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>

            {(searchTerm || selectedApplication || statusFilter) && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedApplication(null);
                  setStatusFilter(null);
                }}
                className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors"
              >
                <X size={20} />
              </button>
            )}
          </div>

          {/* EMI Groups */}
          <div className="space-y-4">
            {Object.entries(paymentsGroupedByEmiId).map(([emiId, { payments, vehicleNames }]) => {
              const uniqueVehicleDetails = Array.from(vehicleNames).join(", ");
              const isExpanded = expandedEmiId === emiId;
              
              return (
                <div key={emiId} className="bg-slate-800 rounded-lg shadow-lg overflow-hidden">
                  <div
                    className="flex justify-between items-center cursor-pointer hover:bg-slate-700/30 transition-colors px-6 py-4"
                    onClick={() => setExpandedEmiId(isExpanded ? null : emiId)}
                  >
                    <div className="space-y-1">
                      <h2 className="text-lg font-semibold">EMI ID: {emiId}</h2>
                      <p className="text-sm text-slate-400">{uniqueVehicleDetails}</p>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                  
                  {isExpanded && (
                    <div className="border-t border-slate-700">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-slate-700 bg-slate-800/50">
                              <th className="text-left py-3 px-6 text-slate-400 font-medium">Date</th>
                              <th className="text-left py-3 px-6 text-slate-400 font-medium">Amount</th>
                              <th className="text-left py-3 px-6 text-slate-400 font-medium">Payment ID</th>
                              <th className="text-left py-3 px-6 text-slate-400 font-medium">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {payments.map(payment => (
                              <tr 
                                key={payment.payment_id} 
                                className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors"
                              >
                                <td className="py-4 px-6">{formatDate(payment.payment_date)}</td>
                                <td className="py-4 px-6 font-medium">{formatCurrency(payment.amount)}</td>
                                <td className="py-4 px-6 font-mono text-sm">{payment.payment_id}</td>
                                <td className="py-4 px-6">
                                  <Badge variant={payment.emi_status.toLowerCase()}>
                                    {payment.emi_status}
                                  </Badge>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentHistoryPage;