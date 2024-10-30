import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true"; // Boolean check

  // Log the authentication status for debugging
  console.log("Is Authenticated:", isAuthenticated);

  // Redirect to login if the user is not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // If authenticated, render the child component
  return children;
};

export default PrivateRoute;
