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
  LogOut
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard', path: '/home' },
  { icon: <FileText className="w-5 h-5" />, label: 'Loan Applications', path: '/Application_form' },
  { icon: <CreditCard className="w-5 h-5" />, label: 'Active Loans', path: '/ActiveLoans' },
  { icon: <Clock className="w-5 h-5" />, label: 'Payment History', path: '/PaymentHistoryPage' },
  { icon: <PiggyBank className="w-5 h-5" />, label: 'EMI Calculator', path: '/EMICalculator' },
  { icon: <Wallet className="w-5 h-5" />, label: 'Make Payment', path: '/EMIPaymentPage' },
  { icon: <LogOut className="w-5 h-5" />, label: 'LogOut', path: '/' },
];

const UserSidebar = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({ name: "User" });
  const [loading, setLoading] = useState(true);

  const handleLogout = (e) => {
    e.preventDefault(); // Prevents navigation
    console.log("Logging out...");
    sessionStorage.removeItem("userSession");
    localStorage.removeItem("userId");
    navigate("/login");
  };

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

  return (
    <div className="flex flex-col h-screen bg-slate-800 text-white w-64">
      {/* Profile Section */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center">
            <span className="text-xl font-semibold">
              {userInfo.name?.charAt(0) || 'U'}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-lg">
              Welcome, {userInfo.name}!
            </span>
            <span className="text-sm text-slate-400">
              ID: {userInfo.id}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 overflow-y-auto py-4">
        <div className="px-4 space-y-2">
          {navItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.label === 'LogOut' ? '/' : item.path}
              onClick={item.label === 'LogOut' ? handleLogout : undefined}
              className={({ isActive }) =>
                `flex items-center space-x-3 w-full p-3 rounded-lg transition-all duration-200 ${
                  isActive 
                    ? 'bg-slate-700 text-white' 
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <span className="text-slate-400 group-hover:text-white">
                {item.icon}
              </span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700">
        <div className="text-sm text-slate-400 text-center">
          © 2024 Loan Management
        </div>
      </div>
    </div>
  );
};

export default UserSidebar;
