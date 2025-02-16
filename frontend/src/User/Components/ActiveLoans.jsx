import React, { useState, useEffect } from "react";
import { AlertCircle, Loader, ChevronDown, ChevronUp, DollarSign, Calendar, Percent, User } from 'lucide-react';
import UserSidebar from "./UserSidebar";

// StatusBadge component for displaying loan statuses with color-coded badges
const StatusBadge = ({ status }) => {
  const baseClasses = "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide";
  const statusClasses = {
    Ongoing: "bg-blue-200 text-blue-800",
    Approved: "bg-green-200 text-green-800",
    Rejected: "bg-red-200 text-red-800",
    Pending: "bg-yellow-200 text-yellow-800"
  };

  return <span className={`${baseClasses} ${statusClasses[status] || ""}`}>{status}</span>;
};

// Loader component for consistent loading UI
const LoadingSpinner = () => (
  <div className="flex justify-center items-center w-full min-h-screen bg-gray-900">
    <Loader className="animate-spin h-12 w-12 text-blue-500" />
    <span className="ml-4 text-2xl font-semibold text-gray-200">Loading...</span>
  </div>
);

// Error display component for consistent error messages
const ErrorDisplay = ({ message }) => (
  <div className="flex justify-center items-center bg-gray-900 min-h-screen">
    <AlertCircle className="h-12 w-12 text-red-500" />
    <span className="ml-4 text-2xl font-semibold text-red-400">{message}</span>
  </div>
);

const ActiveLoans = () => {
  const [loanDetails, setLoanDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedLoan, setExpandedLoan] = useState(null);

  useEffect(() => {
    const fetchActiveLoans = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        setError("User ID not found.");
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:5000/api/active-loans/${userId}`);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        setLoanDetails(data);
      } catch (err) {
        console.error("Error fetching active loans:", err);
        setError("Failed to fetch active loans. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchActiveLoans();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay message={error} />;

  return (
    <div className="flex bg-gray-900 min-h-screen">
      <UserSidebar />
      <main className="flex-1 p-8">
        <h2 className="text-4xl font-bold mb-8 text-white border-b border-gray-700 pb-4">Your Active Loans</h2>
        {loanDetails.length === 0 ? (
          <p className="text-center text-gray-400">You have no active loans at the moment.</p>
        ) : (
          <div className="space-y-6">
            {loanDetails.map((loan) => (
              <LoanItem 
                key={loan.id} 
                loan={loan} 
                isExpanded={expandedLoan === loan.id} 
                toggleExpand={() => setExpandedLoan(expandedLoan === loan.id ? null : loan.id)} 
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

// Loan item with conditional rendering for expanded details
const LoanItem = ({ loan, isExpanded, toggleExpand }) => (
  <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-2xl">
    <div className="p-6 cursor-pointer" onClick={toggleExpand}>
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-blue-400">{loan.model_name}</h3>
        <div className="flex space-x-2">
          <StatusBadge status={loan.emi_status} />
          <StatusBadge status={loan.application_status} />
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
        <InfoCard icon={<User className="h-5 w-5" />} label="Applicant" value={loan.name} />
        <InfoCard icon={<DollarSign className="h-5 w-5" />} label="Loan Amount" value={`$${loan.loan_amount}`} />
        <InfoCard icon={<Calendar className="h-5 w-5" />} label="Tenure" value={`${loan.tenure} months`} />
        <InfoCard icon={<Percent className="h-5 w-5" />} label="Interest" value={`${loan.interest_rate}%`} />
      </div>
      {isExpanded ? <ChevronUp className="h-6 w-6 text-gray-400 mt-4 mx-auto" /> : <ChevronDown className="h-6 w-6 text-gray-400 mt-4 mx-auto" />}
    </div>
    {isExpanded && <LoanDetail loan={loan} />}
  </div>
);

// Expanded loan detail section
const LoanDetail = ({ loan }) => (
  <div className="px-6 pb-6 pt-2 bg-gray-750 border-t border-gray-700">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <DetailItem label="Vehicle ID" value={loan.vehicle_id} />
      <DetailItem label="Mfd" value={loan.mfd} />
      <DetailItem label="Price" value={`$${loan.price}`} />
      <DetailItem label="Brand" value={loan.brand} />
      <DetailItem label="EMI Amount" value={`$${loan.emi_amount}`} />
      <DetailItem label="Mobile" value={loan.mobileNumber} />
      <DetailItem label="PAN Number" value={loan.panNumber} />
      <DetailItem label="DOB" value={loan.dob} />
      <DetailItem label="Email" value={loan.email} />
      <DetailItem label="Address" value={loan.address} />
    </div>
  </div>
);

// Generalized info card
const InfoCard = ({ icon, label, value }) => (
  <div className="flex items-center space-x-2 text-gray-300">
    {icon}
    <div>
      <p className="text-xs text-gray-400">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  </div>
);

// Detail item display
const DetailItem = ({ label, value }) => (
  <div className="text-gray-300">
    <span className="font-semibold text-gray-400">{label}:</span> {value}
  </div>
);

export default ActiveLoans;
