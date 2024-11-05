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
  CheckCircle,  
  Clock,
  DollarSign,
  User,
  Settings,
  CreditCard,
  AlertCircle,
  Link2,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom"; // Ensure useNavigate is imported

const Card = ({ children, className }) => (
  <div className={`bg-slate-800 rounded-lg shadow-md p-6 ${className}`}>
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

const Alert = ({ children, className }) => (
  <div className={`p-4 rounded-md bg-slate-700 text-white ${className}`}>
    {children}
  </div>
);

const AlertDescription = ({ children }) => <p>{children}</p>;

const UserDashboard = () => {
  const navigate = useNavigate(); // Define navigate at the top of the component
  const [loanAmount, setLoanAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [tenure, setTenure] = useState("");
  const [calculatedEmi, setCalculatedEmi] = useState(null);
  const [userInfo, setUserInfo] = useState(null); // To store fetched user info
  const [loading, setLoading] = useState(true); // Track loading state

  // Fetch user info from API on component mount
  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (userId) {
      axios
        .get(`http://localhost:5000/api/user/${userId}`)
        .then((response) => {
          setUserInfo(response.data); // Save user info to state
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching user info:", error);
          navigate("/login"); // Redirect to login if user info fetch fails
        });
    } else {
      navigate("/login"); // Redirect to login if userId is not found
    }
  }, [navigate]); // Add navigate to the dependencies array

  const calculateEMI = () => {
    const principal = parseFloat(loanAmount);
    const ratePerMonth = parseFloat(interestRate) / (12 * 100);
    const tenureMonths = parseFloat(tenure) * 12;

    const emi =
      (principal * ratePerMonth * Math.pow(1 + ratePerMonth, tenureMonths)) /
      (Math.pow(1 + ratePerMonth, tenureMonths) - 1);

    setCalculatedEmi(emi.toFixed(2));
  };

  const data = [
    { name: "Aug", amount: 15000 },
    { name: "Sep", amount: 15000 },
    { name: "Oct", amount: 15000 },
  ];

  // Show loading state if data is not yet fetched
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white p-6">Loading...</div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white">
                Welcome back, {userInfo.name}!
              </h1>
              <p className="text-slate-400 mt-2">
                Manage your loans and applications
              </p>
            </div>
            <div className="flex gap-4">
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600">
                <User className="h-4 w-4" />
                Profile
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600">
                <Settings className="h-4 w-4" />
                Settings
              </button>
            </div>
          </div>
        </header>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-white">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/Application_form"
              className="flex items-center justify-center gap-2 p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <FileText className="h-5 w-5" />
              New Loan Application
            </Link>
            <Link to="/EMIPaymentPage" className="flex items-center justify-center gap-2 p-4 bg-green-600 text-white rounded-lg hover:bg-green-700">
              <DollarSign className="h-5 w-5" />
              Make Payment
            </Link>
            <Link to="/ActiveLoans" className="flex items-center justify-center gap-2 p-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
              <CreditCard className="h-5 w-5" />
              Active Loans
            </Link>
          </div>
        </div>

        {/* Important Alerts */}
        <div className="mb-8">
          <Alert>
            <AlertCircle className="h-4 w-4 text-amber-500" />
            <AlertDescription>
              Your next EMI payment of ₹{userInfo.nextPaymentAmount} is due on{" "}
              {userInfo.nextEmiDate}
            </AlertDescription>
          </Alert>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Credit Score Card */}
          <Card className="hover:bg-slate-700 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>Credit Score</CardTitle>
              <CreditCard className="h-5 w-5 text-blue-400" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-white">
                {userInfo.creditScore}
              </p>
              <div className="w-full bg-slate-600 rounded-full h-2.5 mt-2">
                <div
                  className="bg-green-500 h-2.5 rounded-full"
                  style={{ width: `${(userInfo.creditScore / 900) * 100}%` }}
                ></div>
              </div>
            </CardContent>
          </Card>

          {/* EMI Calculator Card */}
          <Card className="hover:bg-slate-700 transition-colors col-span-1 md:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>EMI Calculator</CardTitle>
              <Calculator className="h-5 w-5 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Loan Amount
                  </label>
                  <input
                    type="number"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(e.target.value)}
                    className="w-full p-2 border bg-slate-700 text-white border-slate-600 rounded-md"
                    placeholder="Enter amount"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Interest Rate (%)
                  </label>
                  <input
                    type="number"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                    className="w-full p-2 border bg-slate-700 text-white border-slate-600 rounded-md"
                    placeholder="Enter rate"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Tenure (Years)
                  </label>
                  <input
                    type="number"
                    value={tenure}
                    onChange={(e) => setTenure(e.target.value)}
                    className="w-full p-2 border bg-slate-700 text-white border-slate-600 rounded-md"
                    placeholder="Enter years"
                  />
                </div>
              </div>
              <button
                onClick={calculateEMI}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Calculate EMI
              </button>
              {calculatedEmi && (
                <div className="mt-4 p-4 bg-slate-700 rounded-md">
                  <p className="text-lg font-semibold text-white">
                    Monthly EMI:
                  </p>
                  <p className="text-3xl font-bold text-blue-400">
                    ₹{calculatedEmi}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card className="hover:bg-slate-700 transition-colors col-span-1 md:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>Recent Transactions</CardTitle>
              <Clock className="h-5 w-5 text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-slate-700">
                {userInfo && userInfo.recentTransactions ? (
                  userInfo.recentTransactions.map((transaction, index) => (
                    <div
                      key={index}
                      className="py-3 flex justify-between items-center"
                    >
                      <div>
                        <p className="font-medium text-white">
                          {transaction.date}
                        </p>
                        <p className="text-sm text-slate-400">EMI Payment</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-white">
                          ₹{transaction.amount}
                        </p>
                        <p className="text-sm text-green-400">
                          {transaction.status}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-400">
                    No recent transactions available
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Total Outstanding */}
          <Card className="hover:bg-slate-700 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>Total Outstanding</CardTitle>
              <DollarSign className="h-5 w-5 text-red-400" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-white">
                ₹
                {userInfo.totalOutstanding
                  ? userInfo.totalOutstanding.toLocaleString()
                  : "0"}
              </p>

              <p className="text-sm text-slate-400 mt-1">
                Across all active loans
              </p>
            </CardContent>
          </Card>

          {/* Transaction History Chart */}
          <Card className="hover:bg-slate-700 transition-colors col-span-1 md:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>Transaction History</CardTitle>
              <BarChart className="h-5 w-5 text-purple-400" />
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
                  <XAxis dataKey="name" stroke="#a0aec0" />
                  <YAxis stroke="#a0aec0" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#2d3748",
                      border: "none",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="amount" fill="#6366f1" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
