import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false); // State to manage mobile menu

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-primary-600 dark:text-primary-400 text-2xl font-bold">
            EMI Management
          </Link>
          <div className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition duration-300">
              Home
            </Link>
            <Link to="/about" className="text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition duration-300">
              About
            </Link>
            <Link to="/emi-calculator" className="text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition duration-300">
              EMI Calculator
            </Link>
            <Link to="/application-form" className="text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition duration-300">
              Application Form
            </Link>
            <Link to="/my-account" className="text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition duration-300">
              My Account
            </Link>
          </div>
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-gray-900 dark:text-white focus:outline-none">
              {/* Hamburger Icon */}
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800">
          <div className="px-4 py-2 space-y-2">
            <Link to="/" className="block text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition duration-300">
              Home
            </Link>
            <Link to="/about" className="block text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition duration-300">
              About
            </Link>
            <Link to="/emi-calculator" className="block text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition duration-300">
              EMI Calculator
            </Link>
            <Link to="/application-form" className="block text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition duration-300">
              Application Form
            </Link>
            <Link to="/my-account" className="block text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition duration-300">
              My Account
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
