import React, { useEffect, useState } from "react";
import {
  CheckCircle, Calendar, User, DollarSign,
  FileText, Users, CreditCard, ChevronDown, Search,
  Download, Clock, Check, TrendingUp, AlertCircle
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import AdminNavBar from "./AdminNavBar";

const Sidebar = () => <AdminNavBar />;

const EMIDisbursementAdmin = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/approved-emi-applications');
        if (!response.ok) throw new Error('Failed to fetch applications');
        const data = await response.json();
        setApplications(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  // Calculate dashboard metrics
  const calculateMetrics = () => {
    return applications.reduce((acc, app) => {
      acc.totalLoanAmount += Number(app.loan_amount) || 0;
      acc.totalDisbursed += Number(app.loan_amount - app.remaining_amount) || 0;
      acc.totalActiveBorrowers += 1;
      acc.completedEMIs += app.payments.length || 0;
      return acc;
    }, {
      totalLoanAmount: 0,
      totalDisbursed: 0,
      totalActiveBorrowers: 0,
      completedEMIs: 0
    });
  };

  const metrics = calculateMetrics();

  // Generate payment trend data
  const generatePaymentTrends = () => {
    const monthlyTotals = applications.reduce((acc, app) => {
      app.payments.forEach(payment => {
        const month = new Date(payment.last_payment_date).toLocaleString('default', { month: 'short' });
        acc[month] = (acc[month] || 0) + Number(payment.last_payment_amount);
      });
      return acc;
    }, {});

    return Object.entries(monthlyTotals).map(([month, amount]) => ({
      month,
      amount
    }));
  };

  const MetricCard = ({ icon: Icon, label, value }) => (
    <div className="bg-gray-800/40 backdrop-blur-md p-6 rounded-2xl border border-gray-700/50 hover:border-gray-600 transition-colors">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-gray-700/30 rounded-xl">
          <Icon className="text-gray-300" size={24} />
        </div>
      </div>
      <div>
        <h3 className="text-gray-400 text-sm">{label}</h3>
        <p className="text-2xl font-bold text-white mt-1">{value}</p>
      </div>
    </div>
  );

  const ApplicationCard = ({ application }) => {
    const progress = ((application.loan_amount - application.remaining_amount) / application.loan_amount) * 100;
    
    return (
      <div className="bg-gray-800/40 backdrop-blur-md rounded-2xl border border-gray-700/50 hover:border-gray-600 transition-colors">
        <div className="p-6 border-b border-gray-700/50">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center">
                <User className="text-blue-400" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">{application.user.user_name}</h3>
                <p className="text-sm text-gray-400">{application.user.user_email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                progress === 100 
                  ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-500/30'
                  : 'bg-blue-900/30 text-blue-400 border border-blue-500/30'
              }`}>
                {progress === 100 ? 'Completed' : 'Active'}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-900/50 p-4 rounded-xl">
              <p className="text-sm text-gray-400">Loan Amount</p>
              <p className="text-lg font-semibold text-white">
                ${Number(application.loan_amount).toLocaleString()}
              </p>
            </div>
            <div className="bg-gray-900/50 p-4 rounded-xl">
              <p className="text-sm text-gray-400">EMI Amount</p>
              <p className="text-lg font-semibold text-white">
                ${Number(application.emi_amount).toLocaleString()}
              </p>
            </div>
            <div className="bg-gray-900/50 p-4 rounded-xl">
              <p className="text-sm text-gray-400">Remaining</p>
              <p className="text-lg font-semibold text-white">
                ${Number(application.remaining_amount).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="relative w-full h-4 bg-gray-700/50 rounded-full">
            <div
              className={`absolute top-0 left-0 h-full rounded-full transition-all duration-500 ease-in-out`}
              style={{
                width: `${progress}%`,
                background: `linear-gradient(to right, #3B82F6, #60A5FA)`,
              }}
            />
            <div className="absolute inset-0 flex justify-between items-center px-2">
              <span className="text-sm font-medium text-gray-300">
                {progress.toFixed(0)}%
              </span>
            </div>
          </div>

          {application.payments.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">Recent Payments</h4>
              {application.payments.slice(0, 3).map((payment, index) => (
                <div key={index} className="bg-gray-900/50 p-4 rounded-xl">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-400">Payment Date</p>
                      <p className="text-white">
                        {new Date(payment.last_payment_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-400">Amount</p>
                      <p className="text-lg font-semibold text-white">
                        ${Number(payment.last_payment_amount).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-4 mx-auto" />
          <p className="text-gray-400">Loading applications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-900">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mb-4 mx-auto" />
          <p className="text-red-400">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Sidebar />
      <div className="flex-1">
        <header className="bg-gray-900/50 border-b border-gray-700/50 px-8 py-6 sticky top-0 z-10 backdrop-blur-lg">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-6">
              <h1 className="text-3xl font-bold text-white">EMI Dashboard</h1>
              <div className="flex items-center bg-gray-800/50 rounded-xl px-4 py-2 border border-gray-700/50 hover:border-gray-600 transition-colors">
                <Search className="text-gray-400 mr-2" size={20} />
                <input
                  type="text"
                  placeholder="Search applications..."
                  className="bg-transparent border-none text-white placeholder-gray-500 focus:outline-none"
                />
              </div>
            </div>
            <button className="text-white bg-blue-600 hover:bg-blue-700 font-semibold px-6 py-2 rounded-lg flex items-center transition-colors">
              <Download size={18} className="mr-2" />
              Export Report
            </button>
          </div>
        </header>

        <main className="p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Key Metrics</h2>
            <div className="grid grid-cols-4 gap-4">
              <MetricCard icon={DollarSign} label="Total Loan Amount" value={`$${metrics.totalLoanAmount.toLocaleString()}`} />
              <MetricCard icon={CreditCard} label="Total Disbursed" value={`$${metrics.totalDisbursed.toLocaleString()}`} />
              <MetricCard icon={Users} label="Active Borrowers" value={metrics.totalActiveBorrowers} />
              <MetricCard icon={TrendingUp} label="Completed EMIs" value={metrics.completedEMIs} />
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Payment Trends</h2>
            <div className="bg-gray-800/40 backdrop-blur-md rounded-2xl border border-gray-700/50 hover:border-gray-600 transition-colors p-6">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={generatePaymentTrends()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" />
                  <YAxis stroke="rgba(255,255,255,0.5)" />
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', border: 'none' }} />
                  <Line type="monotone" dataKey="amount" stroke="#3B82F6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Applications</h2>
            <div className="grid grid-cols-3 gap-6">
              {applications.map((app) => (
                <ApplicationCard key={app.id} application={app} />
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default EMIDisbursementAdmin;