// import React, { useState } from "react";
// import axios from "axios";
// import { Link, useNavigate } from "react-router-dom";

// const Signup = () => {
//   const [name, setName] = useState("");
//   const [mobileNumber, setMobileNumber] = useState(""); // New state for mobile number
//   const [panNumber, setPanNumber] = useState(""); // Renamed from legalID to panNumber
//   const [dob, setDob] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [address, setAddress] = useState(""); // New state for address
//   const [addressProofFile, setAddressProofFile] = useState(null); // New state for address proof file
//   const [panFile, setPanFile] = useState(null); // New state for PAN file
//   const [serviceType, setServiceType] = useState(""); // New state for service type
//   const [monthlyIncome, setMonthlyIncome] = useState(""); // New state for monthly income
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError(""); // Clear any previous error

//     const formData = new FormData(); // Create FormData object for file uploads
//     formData.append("name", name);
//     formData.append("mobileNumber", mobileNumber);
//     formData.append("panNumber", panNumber);
//     formData.append("dob", dob);
//     formData.append("email", email);
//     formData.append("password", password);
//     formData.append("address", address);
//     formData.append("addressProofFile", addressProofFile);
//     formData.append("panFile", panFile);
//     formData.append("serviceType", serviceType);
//     formData.append("monthlyIncome", monthlyIncome);

//     try {
//       const response = await axios.post(
//         "http://localhost:5000/api/signup",
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data", // Set content type for file upload
//           },
//         }
//       );

//       alert(response.data.message); // Display success message
//       navigate("/login"); // Navigate to the desired route after signup
//     } catch (error) {
//       if (error.response) {
//         setError(error.response.data.message); // Set error message from the server
//       } else {
//         setError("An unexpected error occurred."); // Generic error message
//       }
//     }
//   };

//   return (
//     <section className="bg-slate-50 dark:bg-slate-900 min-h-screen">
//       <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900">
//         <section className=" bg-slate-50 dark:bg-slate-900">
//           <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
//             <h1 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white">
//               EMI Management System - Signup
//             </h1>
//             <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-slate-800 dark:border-slate-700">
//               <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
//                 <h2 className="text-xl font-bold leading-tight tracking-tight text-slate-900 md:text-2xl dark:text-white">
//                   Create Your EMI Account
//                 </h2>
//                 <form
//                   className="space-y-4 md:space-y-6"
//                   onSubmit={handleSubmit}
//                 >
//                   {/* Name Field */}
//                   <div>
//                     <label
//                       htmlFor="name"
//                       className="block mb-2 text-sm font-medium text-slate-900 dark:text-white"
//                     >
//                       Full Name
//                     </label>
//                     <input
//                       type="text"
//                       value={name}
//                       onChange={(e) => setName(e.target.value)}
//                       className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
//                       placeholder="John Doe"
//                       required
//                       autoComplete="name"
//                     />
//                   </div>

//                   {/* Mobile Number Field */}
//                   <div>
//                     <label
//                       htmlFor="mobileNumber"
//                       className="block mb-2 text-sm font-medium text-slate-900 dark:text-white"
//                     >
//                       Mobile Number
//                     </label>
//                     <input
//                       type="text"
//                       value={mobileNumber}
//                       onChange={(e) => setMobileNumber(e.target.value)}
//                       className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
//                       placeholder="Enter your mobile number"
//                       required
//                       autoComplete="tel"
//                     />
//                   </div>

//                   {/* PAN Number Field */}
//                   <div>
//                     <label
//                       htmlFor="panNumber"
//                       className="block mb-2 text-sm font-medium text-slate-900 dark:text-white"
//                     >
//                       PAN Number
//                     </label>
//                     <input
//                       type="text"
//                       value={panNumber}
//                       onChange={(e) => setPanNumber(e.target.value)}
//                       className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
//                       placeholder="Enter your PAN number"
//                       required
//                       autoComplete="off"
//                     />
//                   </div>

//                   {/* Date of Birth Field */}
//                   <div>
//                     <label
//                       htmlFor="dob"
//                       className="block mb-2 text-sm font-medium text-slate-900 dark:text-white"
//                     >
//                       Date of Birth
//                     </label>
//                     <input
//                       type="date"
//                       value={dob}
//                       onChange={(e) => setDob(e.target.value)}
//                       className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
//                       required
//                       autoComplete="bday"
//                     />
//                   </div>

//                   {/* Email Field */}
//                   <div>
//                     <label
//                       htmlFor="email"
//                       className="block mb-2 text-sm font-medium text-slate-900 dark:text-white"
//                     >
//                       Email
//                     </label>
//                     <input
//                       type="email"
//                       value={email}
//                       onChange={(e) => setEmail(e.target.value)}
//                       className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
//                       placeholder="example@example.com"
//                       required
//                       autoComplete="email"
//                     />
//                   </div>

//                   {/* Password Field */}
//                   <div>
//                     <label
//                       htmlFor="password"
//                       className="block mb-2 text-sm font-medium text-slate-900 dark:text-white"
//                     >
//                       Password
//                     </label>
//                     <input
//                       type="password"
//                       value={password}
//                       onChange={(e) => setPassword(e.target.value)}
//                       className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
//                       placeholder="••••••••"
//                       required
//                       autoComplete="new-password"
//                     />
//                   </div>

//                   {/* Address Field */}
//                   <div>
//                     <label
//                       htmlFor="address"
//                       className="block mb-2 text-sm font-medium text-slate-900 dark:text-white"
//                     >
//                       Address
//                     </label>
//                     <input
//                       type="text"
//                       value={address}
//                       onChange={(e) => setAddress(e.target.value)}
//                       className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
//                       placeholder="Enter your address"
//                       required
//                       autoComplete="street-address"
//                     />
//                   </div>

//                   {/* Service Type Field */}
//                   <div>
//                     <label
//                       htmlFor="serviceType"
//                       className="block mb-2 text-sm font-medium text-slate-900 dark:text-white"
//                     >
//                       Service Type
//                     </label>
//                     <select
//                       value={serviceType}
//                       onChange={(e) => setServiceType(e.target.value)}
//                       className="bg-slate-50 border border-slate-300 text-slate-900 text-m rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
//                       required
//                       autoComplete="off"
//                     >
//                       <option value="" disabled>
//                         Choose an option
//                       </option>
//                       <option value="Government">Government</option>
//                       <option value="Private">Private</option>
//                       <option value="Business">Business</option>
//                     </select>
//                   </div>

//                   {/* Monthly Income Field */}
//                   <div>
//                     <label
//                       htmlFor="monthlyIncome"
//                       className="block mb-2 text-sm font-medium text-slate-900 dark:text-white"
//                     >
//                       Monthly Income
//                     </label>
//                     <input
//                       type="number"
//                       value={monthlyIncome}
//                       onChange={(e) => setMonthlyIncome(e.target.value)}
//                       className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
//                       placeholder="Enter your monthly income"
//                       required
//                       autoComplete="off"
//                     />
//                   </div>

//                   {/* Error Message */}
//                   {error && <p className="text-red-500 text-sm">{error}</p>}

//                   <button
//                     type="submit"
//                     className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
//                   >
//                     Sign Up
//                   </button>
//                 </form>
//               </div>
//             </div>
//           </div>
//         </section>
//       </div>
//     </section>
//   );
// };

// export default Signup;

import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [name, setName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [panNumber, setPanNumber] = useState("");
  const [dob, setDob] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [panFile, setPanFile] = useState(null);
  const [serviceType, setServiceType] = useState("");
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear any previous error

    const formData = new FormData();
    formData.append("name", name);
    formData.append("mobileNumber", mobileNumber);
    formData.append("panNumber", panNumber);
    formData.append("dob", dob);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("address", address);
    formData.append("panFile", panFile);
    formData.append("serviceType", serviceType);
    formData.append("monthlyIncome", monthlyIncome);

    console.log("Form data being sent:", {
      name,
      mobileNumber,
      panNumber,
      dob,
      email,
      password,
      address,
      panFile,
      serviceType,
      monthlyIncome,
    });

    try {
      const response = await axios.post(
        "http://localhost:5000/api/signup",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Response from server:", response.data);
      alert(response.data.message);
      navigate("/login");
    } catch (error) {
      console.error("Error during signup:", error);
      if (error.response) {
        setError(error.response.data.message);
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="bg-white rounded-lg shadow-md p-6 space-y-4 dark:bg-slate-800 dark:shadow-lg">
        <h2 className="text-2xl font-bold text-center text-slate-900 dark:text-white">Signup</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full Name"
            required
            className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg block w-full p-2.5 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 dark:text-white"
          />
          <input
            type="text"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            placeholder="Mobile Number"
            required
            className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg block w-full p-2.5 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 dark:text-white"
          />
          <input
            type="text"
            value={panNumber}
            onChange={(e) => setPanNumber(e.target.value)}
            placeholder="PAN Number"
            required
            className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg block w-full p-2.5 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 dark:text-white"
          />
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            required
            className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg block w-full p-2.5 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 dark:text-white"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg block w-full p-2.5 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 dark:text-white"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg block w-full p-2.5 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 dark:text-white"
          />
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Address"
            required
            className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg block w-full p-2.5 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 dark:text-white"
          />
          <select
            value={serviceType}
            onChange={(e) => setServiceType(e.target.value)}
            required
            className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg block w-full p-2.5 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 dark:text-white"
          >
            <option value="" disabled>
              Select Service Type
            </option>
            <option value="Government">Government</option>
            <option value="Private">Private</option>
            <option value="Business">Business</option>
          </select>
          <input
            type="number"
            value={monthlyIncome}
            onChange={(e) => setMonthlyIncome(e.target.value)}
            placeholder="Monthly Income"
            required
            className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg block w-full p-2.5 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 dark:text-white"
          />

          {/* File input for PAN File */}
          <input
            type="file"
            onChange={(e) => setPanFile(e.target.files[0])}
            required
            className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg block w-full p-2.5 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 dark:text-white"
          />

          {/* Submit and Error */}
          <button
            type="submit"
            className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Sign Up
          </button>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default Signup;
