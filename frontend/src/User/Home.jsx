import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Calculator,
  FileText,
  Clock,
  DollarSign,
  User,
  CreditCard,
  AlertCircle,
  LogOut,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Card = ({ children, className }) => (
  <div className={`bg-slate-800 rounded-xl shadow-lg p-6 transition-all duration-200 hover:shadow-xl hover:scale-[1.02] ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children, className }) => (
  <div className={`mb-4 ${className}`}>{children}</div>
);

const CardTitle = ({ children, className }) => (
  <h3 className={`text-lg font-semibold text-white ${className}`}>
    {children}
  </h3>
);

const CardContent = ({ children }) => (
  <div className="text-slate-300">{children}</div>
);

const UserDashboard = () => {
  const navigate = useNavigate();
  const [loanAmount, setLoanAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [tenure, setTenure] = useState("");
  const [calculatedEmi, setCalculatedEmi] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      axios
        .get(`http://localhost:5000/api/user/${userId}`)
        .then((response) => {
          setUserInfo(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching user info:", error);
          navigate("/login");
        });
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const calculateEMI = () => {
    const principal = parseFloat(loanAmount);
    const ratePerMonth = parseFloat(interestRate) / (12 * 100);
    const tenureMonths = parseFloat(tenure) * 12;

    const emi =
      (principal * ratePerMonth * Math.pow(1 + ratePerMonth, tenureMonths)) /
      (Math.pow(1 + ratePerMonth, tenureMonths) - 1);

    setCalculatedEmi(emi.toFixed(2));
  };

  const handleLogout = () => {
    sessionStorage.removeItem("userSession");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  const data = [
    { name: "Aug", amount: 15000 },
    { name: "Sep", amount: 15000 },
    { name: "Oct", amount: 15000 },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="text-slate-300">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      {/* Navigation Bar */}
      <nav className="bg-slate-800/50 backdrop-blur-lg border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">
                Welcome back, {userInfo.name}! 
                <p className="text-slate-200 mt-2 text-lg ">
                Manage your loans and applications
              </p>
              </h1>
            <div className="flex items-center gap-4">
            
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden md:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Alert Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-amber-500/10 to-amber-600/10 border border-amber-500/20 rounded-xl p-4 flex items-start gap-4">
            <AlertCircle className="h-6 w-6 text-amber-500 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-amber-500">Payment Due</h3>
              <p className="text-slate-300">
                Your next EMI payment of ₹{userInfo.nextPaymentAmount} is due on {userInfo.nextEmiDate}
              </p>
            </div>
          </div>
        </div>

        {/* Credit Score and Total Outstanding */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-600/20 to-blue-700/20 border border-blue-500/20">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-400 mb-1">Credit Score</p>
                <p className="text-3xl font-bold">{userInfo.creditScore}</p>
              </div>
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <CreditCard className="h-6 w-6 text-blue-500" />
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(userInfo.creditScore / 900) * 100}%` }}
                ></div>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-purple-600/20 to-purple-700/20 border border-purple-500/20">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-400 mb-1">Total Outstanding</p>
                <p className="text-3xl font-bold">₹{userInfo.totalOutstanding?.toLocaleString() || "0"}</p>
              </div>
              <div className="p-3 bg-purple-500/20 rounded-lg">
                <DollarSign className="h-6 w-6 text-purple-500" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-slate-400">Across all active loans</p>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link
            to="/Application_form"
            className="group bg-gradient-to-br from-blue-600 to-blue-700 p-6 rounded-xl shadow-lg hover:shadow-blue-500/20 transition-all duration-200 hover:scale-[1.02]"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold">New Loan</h3>
                <p className="text-sm text-blue-200">Apply for a new loan</p>
              </div>
            </div>
          </Link>

          <Link
            to="/EMIPaymentPage"
            className="group bg-gradient-to-br from-green-600 to-green-700 p-6 rounded-xl shadow-lg hover:shadow-green-500/20 transition-all duration-200 hover:scale-[1.02]"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500/20 rounded-lg">
                <DollarSign className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold">Make Payment</h3>
                <p className="text-sm text-green-200">Pay your EMI</p>
              </div>
            </div>
          </Link>

          <Link
            to="/ActiveLoans"
            className="group bg-gradient-to-br from-purple-600 to-purple-700 p-6 rounded-xl shadow-lg hover:shadow-purple-500/20 transition-all duration-200 hover:scale-[1.02]"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-500/20 rounded-lg">
                <CreditCard className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold">Active Loans</h3>
                <p className="text-sm text-purple-200">View your loans</p>
              </div>
            </div>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* EMI Calculator */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>EMI Calculator</CardTitle>
              <Calculator className="h-5 w-5 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Loan Amount</label>
                  <input
                    type="number"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(e.target.value)}
                    className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter amount"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Interest Rate (%)</label>
                  <input
                    type="number"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                    className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter rate"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Tenure (Years)</label>
                  <input
                    type="number"
                    value={tenure}
                    onChange={(e) => setTenure(e.target.value)}
                    className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter years"
                  />
                </div>
              </div>
              <button
                onClick={calculateEMI}
                className="mt-6 w-full md:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-200 font-medium"
              >
                Calculate EMI
              </button>
              {calculatedEmi && (
                <div className="mt-6 p-6 bg-gradient-to-br from-blue-600/10 to-blue-700/10 border border-blue-500/20 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400">Monthly EMI</p>
                      <p className="text-3xl font-bold text-white mt-1">₹{calculatedEmi}</p>
                    </div>
                    <div className="p-3 bg-blue-500/20 rounded-lg">
                      <Calculator className="h-6 w-6 text-blue-400" />
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Transactions</CardTitle>
              <Clock className="h-5 w-5 text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userInfo && userInfo.recentTransactions ? (
                  userInfo.recentTransactions.map((transaction, index) => (
                    <div
                      key={index}
                      className="p-4 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">EMI Payment</p>
                          <p className="text-sm text-slate-400">{transaction.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">₹{transaction.amount}</p>
                          <p className="text-sm text-green-400">{transaction.status}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Clock className="h-12 w-12 text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-400">No recent transactions</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;