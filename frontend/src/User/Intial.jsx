import React from "react";
import { Link } from "react-router-dom";

function Intial() {
  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-6 text-slate-900 dark:text-white">
        EMI Management System
      </h1>
      <div className="space-y-4">
        <Link
          to="/login"
          className="w-full max-w-xs bg-black hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
        >
          Login
        </Link>
        <Link
          to="/signup"
          className="w-full max-w-xs bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
        >
          Signup
        </Link>
      </div>
    </div>
  );
}

export default Intial;
