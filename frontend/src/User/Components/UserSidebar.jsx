import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  CreditCard, 
  FileText, 
  Clock, 
  PiggyBank,
  Wallet,
  Download,
  Settings,
  HelpCircle,
  LogOut
} from 'lucide-react';
import { NavLink } from 'react-router-dom';


const navItems = [
  { icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard', path: '/home' },
  { icon: <FileText className="w-5 h-5" />, label: 'Loan Applications', path: '/Application_form' },
  { icon: <CreditCard className="w-5 h-5" />, label: 'Active Loans', path: '/ActiveLoans' },
  { icon: <Clock className="w-5 h-5" />, label: 'Payment History', path: '/history' },
  { icon: <PiggyBank className="w-5 h-5" />, label: 'EMI Calculator', path: '/EMICalculator' },
  { icon: <Wallet className="w-5 h-5" />, label: 'Make Payment', path: '/payment' },
  { icon: <Download className="w-5 h-5" />, label: 'Statements', path: '/statements' },
  { icon: <LogOut className="w-5 h-5" />, label: 'LogOut', path: '/' }, // Change path to a default route
];

const bottomNavItems = [
  { icon: <Settings className="w-5 h-5" />, label: 'Settings', path: '/settings' },
  { icon: <HelpCircle className="w-5 h-5" />, label: 'Help & Support', path: '/support' },
];

const UserSidebar = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({ name: "User" }); // Initialize userInfo state
  const [loading, setLoading] = useState(true); // Initialize loading state
  const handleLogout = () => {
    console.log("Logging out..."); // Debugging log
    sessionStorage.removeItem("userSession"); // Clear session
    navigate("/login"); // Redirect to login
  };
  
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

  return (
    <div className="flex flex-col h-screen bg-slate-800 w-64 md:w-72 text-white">
      {/* Profile Section */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 rounded-full p-3">
            <span className="text-lg font-semibold">JD</span>
          </div>
          <div>
            <h3 className="font-medium">{userInfo.name}!</h3>
            <p className="text-sm text-slate-400">{userInfo.id}</p>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 p-4 space-y-2" role="navigation">
        <div className="space-y-1">
          {navItems.map((item, index) => (
            <NavLink
              to={item.label === 'LogOut' ? '#' : item.path} // Use # for LogOut
              key={index}
              onClick={item.label === 'LogOut' ? handleLogout : null} // Call handleLogout on click
              className={({ isActive }) =>
                `flex items-center space-x-3 w-full p-3 rounded-lg transition-colors ${
                  isActive ? 'bg-slate text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`
              }
              aria-label={item.label}
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>

        {/* Credit Score Card */}
        <div className="mt-6 p-4 bg-slate-700 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm">Credit Score</span>
            <span className="text-sm text-green-400">Good</span>
          </div>
          <div className="text-2xl font-bold">750</div>
          <div className="w-full bg-slate-600 rounded-full h-2 mt-2">
            <div className="bg-green-500 h-2 rounded-full" style={{ width: '75%' }} />
          </div>
        </div>
      </nav>

      {/* Bottom Navigation */}
      <div className="p-4 border-t border-slate-700">
        {bottomNavItems.map((item, index) => (
          <NavLink
            to={item.path}
            key={index}
            className={({ isActive }) =>
              `flex items-center space-x-3 w-full p-3 rounded-lg transition-colors ${
                isActive ? 'bg-slate-700 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white'
              }`
            }
            aria-label={item.label}
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default UserSidebar;
