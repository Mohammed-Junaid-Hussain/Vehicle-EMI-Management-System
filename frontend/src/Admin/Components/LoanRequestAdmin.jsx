import React, { useState, useEffect } from "react";
import { AlertCircle, CheckCircle, XCircle, Loader, ChevronDown, ChevronUp, DollarSign, Calendar, Percent, User } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import AdminSidebar from "./AdminNavBar";

const StatusBadge = ({ status }) => {
  const baseClasses = "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide";
  const statusClasses = {
    Pending: "bg-yellow-200 text-yellow-800",
    Approved: "bg-green-200 text-green-800",
    Rejected: "bg-red-200 text-red-800",
  };

  return (
    <span className={`${baseClasses} ${statusClasses[status]}`}>
      {status}
    </span>
  );
};

const LoanRequestAdmin = () => {
  const [loanDetails, setLoanDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedLoan, setExpandedLoan] = useState(null);
  const [stats, setStats] = useState({ approved: 0, rejected: 0, pending: 0 });

  useEffect(() => {
    const fetchLoanDetails = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/loan-details");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setLoanDetails(data);
        calculateStats(data);
      } catch (err) {
        console.error("Error fetching loan details:", err);
        setError("Failed to fetch loan details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchLoanDetails();
  }, []);

  const calculateStats = (loans) => {
    const stats = loans.reduce((acc, loan) => {
      acc[loan.application_status.toLowerCase()]++;
      return acc;
    }, { approved: 0, rejected: 0, pending: 0 });
    setStats(stats);
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/loan-status/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Error updating loan status");
      }

      const updatedLoanDetails = loanDetails.map((loan) =>
        loan.id === id ? { ...loan, application_status: newStatus } : loan
      );
      setLoanDetails(updatedLoanDetails);
      calculateStats(updatedLoanDetails);
    } catch (error) {
      console.error("Error updating loan status:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <Loader className="animate-spin h-12 w-12 text-blue-500" />
        <span className="ml-4 text-2xl font-semibold text-gray-200">Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <span className="ml-4 text-2xl font-semibold text-red-400">{error}</span>
      </div>
    );
  }

  const pieChartData = [
    { name: 'Approved', value: stats.approved, color: '#10B981' },
    { name: 'Rejected', value: stats.rejected, color: '#EF4444' },
    { name: 'Pending', value: stats.pending, color: '#F59E0B' },
  ];

  const barChartData = loanDetails.map(loan => ({
    name: loan.name,
    amount: loan.loan_amount,
  })).slice(0, 5);

  return (
    <div className="flex min-h-screen bg-gray-900">
      <AdminSidebar />

      <main className="flex-1 p-8">
        <h2 className="text-4xl font-bold mb-8 text-white border-b border-gray-700 pb-4">Loan Request and User Details</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Loan Status Overview</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-around mt-4">
              {pieChartData.map((entry, index) => (
                <div key={`legend-${index}`} className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-2`} style={{ backgroundColor: entry.color }}></div>
                  <span className="text-sm text-gray-300">{entry.name}: {entry.value}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Top 5 Loan Amounts</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={barChartData}>
                <XAxis dataKey="name" tick={{ fill: '#9CA3AF' }} />
                <YAxis tick={{ fill: '#9CA3AF' }} />
                <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none' }} />
                <Bar dataKey="amount" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-6">
          {loanDetails.map((loan) => (
            <div key={loan.id} className="bg-gray-800 rounded-xl shadow-lg overflow-hidden transition duration-300 ease-in-out transform hover:scale-101 hover:shadow-2xl">
              <div className="p-6 cursor-pointer" onClick={() => setExpandedLoan(expandedLoan === loan.id ? null : loan.id)}>
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-bold text-blue-400">{loan.model_name}</h3>
                  <StatusBadge status={loan.application_status} />
                </div>
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <InfoCard icon={<User className="h-5 w-5" />} label="Applicant" value={loan.name} />
                  <InfoCard icon={<DollarSign className="h-5 w-5" />} label="Loan Amount" value={`$${loan.loan_amount}`} />
                  <InfoCard icon={<Calendar className="h-5 w-5" />} label="Tenure" value={`${loan.tenure} months`} />
                  <InfoCard icon={<Percent className="h-5 w-5" />} label="Interest" value={`${loan.interest_rate}%`} />
                </div>
                {expandedLoan === loan.id ? (
                  <ChevronUp className="h-6 w-6 text-gray-400 mt-4 mx-auto" />
                ) : (
                  <ChevronDown className="h-6 w-6 text-gray-400 mt-4 mx-auto" />
                )}
              </div>
              {expandedLoan === loan.id && (
                <div className="px-6 pb-6 pt-2 bg-gray-750 border-t border-gray-700">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <DetailItem label="Vehicle ID" value={loan.vehicle_id} />
                    <DetailItem label="Mfd" value={loan.mfd} />
                    <DetailItem label="Price" value={`$${loan.price}`} />
                    <DetailItem label="Brand" value={loan.brand} />
                    <DetailItem label="EMI Amount" value={`$${loan.emi_amount}`} />
                    <DetailItem label="EMI Status" value={loan.emi_status} />
                    <DetailItem label="Mobile" value={loan.mobileNumber} />
                    <DetailItem label="PAN Number" value={loan.panNumber} />
                    <DetailItem label="DOB" value={loan.dob} />
                    <DetailItem label="Email" value={loan.email} />
                    <DetailItem label="Address" value={loan.address} />
                    <DetailItem label="Service Type" value={loan.serviceType} />
                    <DetailItem label="Monthly Income" value={`$${loan.monthlyIncome}`} />
                    <DetailItem label="Address Proof" value={loan.addressProofFile} />
                    <DetailItem label="PAN Proof" value={loan.panFile} />
                  </div>
                  <div className="mt-6 flex space-x-4">
                    <Button 
                      onClick={() => handleStatusChange(loan.id, "Approved")} 
                      color="green" 
                      icon={<CheckCircle className="h-5 w-5 mr-2" />} 
                      text="Approve" 
                    />
                    <Button 
                      onClick={() => handleStatusChange(loan.id, "Rejected")} 
                      color="red" 
                      icon={<XCircle className="h-5 w-5 mr-2" />} 
                      text="Reject" 
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

const InfoCard = ({ icon, label, value }) => (
  <div className="flex items-center space-x-2 text-gray-300">
    {icon}
    <div>
      <p className="text-xs text-gray-400">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  </div>
);

const DetailItem = ({ label, value }) => (
  <div className="text-gray-300">
    <span className="font-semibold text-gray-400">{label}:</span> {value}
  </div>
);

const Button = ({ onClick, color, icon, text }) => (
  <button
    onClick={onClick}
    className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-${color}-600 hover:bg-${color}-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${color}-500 transition duration-150 shadow-md hover:shadow-lg`}
  >
    {icon}
    {text}
  </button>
);

export default LoanRequestAdmin;