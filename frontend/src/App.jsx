import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./User/Login";
import Signup from "./User/Signup";
import Intial from "./User/Intial";
import Home from "./User/Home";
import ActiveLoans from "./User/Components/ActiveLoans";
import PaymentComponent from "./User/Components/PaymentComponent";

import Admin_Login from "./Admin/Admin_Login";
import Admin_Home from "./Admin/Admin_Home";
import Reg_User from "./Admin/Components/Reg_User";
import Vehicle from "./Admin/Components/Vehicle";
import Application_form from "./User/Components/Application_form";
import EMICalculator from "./User/Components/EMICalculator";
import LoanRequestAdmin from "./Admin/Components/LoanRequestAdmin";
import PrivateRoute from "./User/PrivateRoute"; // Import the PrivateRoute component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Intial />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protect these routes */}
        <Route
          path="/Home"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="/Application_form"
          element={
            <PrivateRoute>
              <Application_form />
            </PrivateRoute>
          }
        />
        <Route
          path="/EMICalculator"
          element={
            <PrivateRoute>
              <EMICalculator />
            </PrivateRoute>
          }
        />
        <Route
          path="/ActiveLoans"
          element={
            <PrivateRoute>
              <ActiveLoans />
            </PrivateRoute>
          }
        />
        <Route
          path="/PaymentComponent"
          element={
            <PrivateRoute>
              <PaymentComponent />
            </PrivateRoute>
          }
        />
        
        <Route path="/admin" element={<Admin_Login />} />
        <Route path="/admin/home" element={<Admin_Home />} />
        <Route path="/admin/Reg_User" element={<Reg_User />} />
        <Route path="/admin/Vehicle" element={<Vehicle />} />
        <Route path="/admin/LoanRequestAdmin" element={<LoanRequestAdmin />} />
      </Routes>
    </Router>
  );
}

export default App;
