import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  CreditCard, 
  Users,
  Car,
  LogOut
} from 'lucide-react';

function AdminSidebar() {
  const [adminEmail, setAdminEmail] = useState('');

  useEffect(() => {
    const fetchAdminDetails = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/admin-details');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setAdminEmail(data.email); // Assuming data has the email field
      } catch (error) {
        console.error('Error fetching admin details:', error);
      }
    };
    fetchAdminDetails();
  }, []);

  return (
    <div className="w-64 bg-gray-600 text-white">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">ADMIN PAGE</h1>

        {/* Admin Email */}
        <div className="flex flex-col items-center mb-8">
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-4">
            <Users className="w-12 h-12 text-gray-500" />
          </div>
          <span className="font-medium">Admin</span>
          <span className="text-sm opacity-75">{adminEmail}</span>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-2">
          <Link
            to="/admin/home"
            className="flex items-center w-full px-4 py-2 rounded-lg hover:bg-gray-800"
          >
            <LayoutDashboard className="w-5 h-5 mr-3" />
            Dashboard
          </Link>
          <Link to="/admin/LoanRequestAdmin" className="flex items-center w-full px-4 py-2 rounded-lg hover:bg-gray-800">
            <FileText className="w-5 h-5 mr-3" />
            Loan Request
          </Link>
          <Link to="/admin/disbursed-request" className="flex items-center w-full px-4 py-2 rounded-lg hover:bg-gray-800">
            <CreditCard className="w-5 h-5 mr-3" />
            Disbursed Request
          </Link>
          <Link to="/admin/Reg_User" className="flex items-center w-full px-4 py-2 rounded-lg hover:bg-gray-800">
            <Users className="w-5 h-5 mr-3" />
            Users
          </Link>
          <Link to="/admin/Vehicle" className="flex items-center w-full px-4 py-2 rounded-lg hover:bg-gray-800">
            <Car className="w-5 h-5 mr-3" />
            Vehicles
          </Link>
          <Link to="/admin/Vehicle" className="flex items-center w-full px-4 py-2 rounded-lg hover:bg-gray-800">
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </Link>
        </nav>
      </div>
    </div>
  );
}

export default AdminSidebar;
