import React, { useState, useEffect } from 'react';
import { CreditCard, AlertCircle, Calendar, DollarSign, Percent, Clock, ChevronRight, Wallet, ArrowRight, Activity } from 'lucide-react';
import axios from 'axios';
import UserSidebar from './UserSidebar';

const EMIPaymentPage = () => {
  const [emiApplications, setEmiApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) {
      setError("User ID not found.");
      setLoading(false);
      return;
    }
    fetchEmiApplications(userId);
  }, []);

  const fetchEmiApplications = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/emi-applications/${userId}`, {
        params: { userId }
      });
      if (Array.isArray(response.data)) {
        setEmiApplications(response.data);
      } else {
        console.error("Expected an array but received:", response.data);
        setEmiApplications([]);
      }
    } catch (error) {
      console.error("Error fetching EMI applications:", error);
      setError("Failed to fetch EMI applications.");
      setEmiApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateProgress = (remainingAmount, loanAmount) => {
    if (!remainingAmount || !loanAmount || loanAmount === 0) return 0;
    const amountPaid = loanAmount - remainingAmount;
    const progress = (amountPaid / loanAmount) * 100;
    return Math.min(Math.max(progress, 0), 100);
  };

  const formatProgress = (remainingAmount, loanAmount) => {
    if (!remainingAmount || !loanAmount) return "0.00";
    const amountPaid = loanAmount - remainingAmount;
    return ((amountPaid / loanAmount) * 100).toFixed(1);
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No Due Date';
    const date = new Date(dateString);
    return isNaN(date) ? 'Invalid Date' : date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    const statusColors = {
      'Ongoing': 'bg-blue-500/15 text-blue-400 border-blue-500/20',
      'Completed': 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
      'Overdue': 'bg-red-500/15 text-red-400 border-red-500/20',
      'Pending': 'bg-amber-500/15 text-amber-400 border-amber-500/20'
    };
    return statusColors[status] || 'bg-slate-500/15 text-slate-400 border-slate-500/20';
  };

  const handlePayment = async (applicationId, emiAmount, remainingAmount) => {
    if (!userId) {
      alert("User ID is missing.");
      return;
    }
    const paymentAmount = Math.min(emiAmount, remainingAmount);
    try {
      const response = await axios.post('http://localhost:5000/api/payments', {
        emi_application_id: applicationId,
        user_id: userId,
        amount: paymentAmount,
      });
      alert(response.data.message);
      fetchEmiApplications(userId);
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed.');
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-900">
      <UserSidebar />

      <div className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col gap-2 mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-800 rounded-lg border border-slate-700">
                <CreditCard className="w-6 h-6 text-slate-300" />
              </div>
              <h1 className="text-2xl font-bold text-slate-200">EMI Payments</h1>
            </div>
            <div className="flex items-center gap-2 ml-11 text-slate-400">
              <Activity className="w-4 h-4" />
              <p className="text-sm">Track and manage your active loan payments</p>
            </div>
          </div>

          {error ? (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              <p>{error}</p>
            </div>
          ) : loading ? (
            <div className="bg-slate-800 rounded-xl border border-slate-700/50">
              <div className="flex items-center justify-center h-40">
                <div className="flex gap-2 items-center">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-75"></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150"></div>
                </div>
              </div>
            </div>
          ) : emiApplications.length === 0 ? (
            <div className="bg-slate-800 rounded-xl border border-slate-700/50">
              <div className="flex flex-col items-center justify-center py-16">
                <div className="p-4 bg-slate-700/50 rounded-full mb-4">
                  <AlertCircle className="w-8 h-8 text-slate-400" />
                </div>
                <p className="text-slate-300 font-medium">No active EMI applications found</p>
                <p className="text-slate-500 text-sm mt-1">Your approved loans will appear here</p>
              </div>
            </div>
          ) : (
            <div className="grid gap-6">
              {emiApplications.map((application) => (
                <div key={application.id} 
                     className="bg-slate-800 rounded-xl border border-slate-700/50 overflow-hidden group hover:border-slate-600 transition-all duration-300">
                  <div className="border-b border-slate-700/50 bg-slate-800/50 px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-slate-700/50 rounded-lg">
                          <Wallet className="w-5 h-5 text-slate-400" />
                        </div>
                        <div>
                          <p className="text-sm text-slate-400">Loan Application</p>
                          <h2 className="text-lg font-semibold text-slate-200">
                            #{application.id}
                          </h2>
                        </div>
                      </div>
                      <span className={`${getStatusColor(application.emi_status)} px-3 py-1 rounded-full text-sm font-medium border`}>
                        {application.emi_status}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 bg-slate-700/30 rounded-lg border border-slate-700 group-hover:border-slate-600 transition-all">
                            <div className="flex items-center gap-2 mb-2">
                              <DollarSign className="w-4 h-4 text-slate-400" />
                              <p className="text-sm text-slate-400">Loan Amount</p>
                            </div>
                            <p className="font-semibold text-slate-200">{formatAmount(application.loan_amount)}</p>
                          </div>
                          <div className="p-4 bg-slate-700/30 rounded-lg border border-slate-700 group-hover:border-slate-600 transition-all">
                            <div className="flex items-center gap-2 mb-2">
                              <Wallet className="w-4 h-4 text-slate-400" />
                              <p className="text-sm text-slate-400">EMI Amount</p>
                            </div>
                            <p className="font-semibold text-slate-200">{formatAmount(application.emi_amount)}</p>
                          </div>
                          <div className="p-4 bg-slate-700/30 rounded-lg border border-slate-700 group-hover:border-slate-600 transition-all">
                            <div className="flex items-center gap-2 mb-2">
                              <Percent className="w-4 h-4 text-slate-400" />
                              <p className="text-sm text-slate-400">Interest Rate</p>
                            </div>
                            <p className="font-semibold text-slate-200">{application.interest_rate}%</p>
                          </div>
                          <div className="p-4 bg-slate-700/30 rounded-lg border border-slate-700 group-hover:border-slate-600 transition-all">
                            <div className="flex items-center gap-2 mb-2">
                              <Clock className="w-4 h-4 text-slate-400" />
                              <p className="text-sm text-slate-400">Tenure</p>
                            </div>
                            <p className="font-semibold text-slate-200">{application.tenure} months</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div className="bg-slate-700/30 rounded-lg p-6 border border-slate-700 group-hover:border-slate-600 transition-all">
                          <div className="mb-6">
                            <div className="flex justify-between mb-2">
                              <span className="text-sm text-slate-400">Payment Progress</span>
                              <span className="text-sm font-medium text-slate-300">
                                {formatAmount(application.loan_amount - (application.remaining_amount || 0))} of {formatAmount(application.loan_amount)} paid
                              </span>
                            </div>
                            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-blue-500 transition-all duration-300"
                                style={{ 
                                  width: `${calculateProgress(
                                    application.remaining_amount,
                                    application.loan_amount
                                  )}%` 
                                }}
                              />
                            </div>
                            <div className="mt-1 text-right">
                              <span className="text-xs text-slate-400">
                                {formatProgress(application.remaining_amount, application.loan_amount)}% Complete
                              </span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="p-3 bg-slate-700/30 rounded-lg border border-slate-700">
                              <div className="flex items-center gap-2 mb-1">
                                <Calendar className="w-4 h-4 text-slate-400" />
                                <p className="text-sm text-slate-400">Next Payment</p>
                              </div>
                              <p className="font-medium text-slate-200">
                                {formatDate(application.next_payment_due)}
                              </p>
                            </div>
                            <div className="p-3 bg-slate-700/30 rounded-lg border border-slate-700">
                              <div className="flex items-center gap-2 mb-1">
                                <DollarSign className="w-4 h-4 text-slate-400" />
                                <p className="text-sm text-slate-400">Remaining</p>
                              </div>
                              <p className="font-medium text-slate-200">
                                {formatAmount(application.remaining_amount)}
                              </p>
                            </div>
                          </div>

                          {application.application_status === 'Approved' && 
                           application.emi_status === 'Ongoing' && (
                            <button 
                              className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 active:bg-blue-700 transition-colors duration-200 font-medium flex items-center justify-center gap-2 group"
                              onClick={() => handlePayment(
                                application.id, 
                                application.emi_amount, 
                                application.remaining_amount
                              )}
                            >
                              Pay EMI Now
                              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EMIPaymentPage;