import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous error messages
  
    try {
      const response = await axios.post("http://localhost:5000/api/login", {
        email,
        password,
      });
  
      // Log the API response for debugging purposes
      console.log("API Response: ", response.data);
  
      // Check if login was successful and user details are returned
      if (response.data && response.data.userId) {
        // Store authenticated flag and userId in localStorage
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("userId", response.data.userId); // Save the userId
  
        alert(response.data.message || "Login successful!"); // Display success message
        navigate("/Home"); // Redirect to the home page on successful login
      } else {
        setError("Login failed. Please check your credentials.");
      }
    } catch (error) {
      // Log the error response for debugging purposes
      console.log("Error response: ", error.response);
      
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message); // Show server error message
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };  
  

  return (
    <section className="bg-slate-50 dark:bg-slate-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <h1 className="text-xl font-bold mb-6 text-slate-900 dark:text-white">
          EMI Management System
        </h1>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-slate-800 dark:border-slate-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h2 className="text-xl font-bold leading-tight tracking-tight text-slate-900 md:text-2xl dark:text-white">
              Sign in to your account
            </h2>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-slate-900 dark:text-white"
                >
                  Your email
                </label>
                <input
                  type="email"
                  id="email"
                  className="bg-slate-50 border border-slate-300 text-slate-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="name@company.com"
                  required
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-slate-900 dark:text-white"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  className="bg-slate-50 border border-slate-300 text-slate-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="••••••••"
                  required
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}{" "}
              {/* Display error message */}
              <button
                type="submit"
                className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                Sign in
              </button>
              <p className="text-xl font-light text-slate-500 dark:text-slate-400">
                Don’t have an account yet?{" "}
                <Link
                  to="/signup"
                  className="font-medium text-black hover:underline dark:text-primary-500"
                >
                  Sign up
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
