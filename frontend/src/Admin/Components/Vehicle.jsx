import React, { useState, useEffect } from "react";
import { Users } from "lucide-react";
import AdminNavBar from "./AdminNavBar";

function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [error, setError] = useState("");
  const [modelName, setModelName] = useState("");
  const [mfd, setMfd] = useState("");
  const [price, setPrice] = useState("");
  const [brand, setBrand] = useState(""); // New state for brand
  const [selectedVehicle, setSelectedVehicle] = useState(null); // New state for editing

  // Fetch vehicles from the database
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/vehicles");
        if (!response.ok) {
          throw new Error("Failed to fetch vehicles");
        }
        const data = await response.json();
        setVehicles(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchVehicles();
  }, []);

  // Function to handle form submission for adding or editing vehicles
  const handleAddOrUpdateVehicle = async (e) => {
    e.preventDefault();
    try {
      const response = selectedVehicle
        ? await fetch(`http://localhost:5000/api/vehicles/${selectedVehicle.vehicle_id}`, {
            method: "PUT", // Use PUT for updates
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model_name: modelName,
              mfd,
              price,
              brand,
            }),
          })
        : await fetch("http://localhost:5000/api/vehicles", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ model_name: modelName, mfd, price, brand }),
          });

      if (!response.ok) {
        throw new Error(selectedVehicle ? "Failed to update vehicle" : "Failed to add vehicle");
      }

      const newVehicle = await response.json();

      if (selectedVehicle) {
        // Update the existing vehicle in the state
        setVehicles(vehicles.map((vehicle) => (vehicle.vehicle_id === selectedVehicle.vehicle_id ? newVehicle : vehicle)));
        setSelectedVehicle(null); // Clear selected vehicle after updating
      } else {
        // Add the new vehicle to the list
        setVehicles([...vehicles, newVehicle]);
      }

      // Clear form fields
      setModelName("");
      setMfd("");
      setPrice("");
      setBrand("");
    } catch (error) {
      setError(error.message);
    }
  };

  // Function to handle edit button click
  const handleEdit = (vehicle) => {
    setSelectedVehicle(vehicle);
    setModelName(vehicle.model_name);
    setMfd(vehicle.mfd);
    setPrice(vehicle.price);
    setBrand(vehicle.brand); // Set the brand
  };

  // Function to handle delete
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/vehicles/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete vehicle");
      }
      setVehicles(vehicles.filter((vehicle) => vehicle.vehicle_id !== id)); // Update state after deletion
    } catch (error) {
      setError(error.message);
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <div className="w-64 bg-gray-600 text-white">
        
          
          <AdminNavBar />
        
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Vehicles</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage and view all vehicles in the system
          </p>
        </div>

        {/* Add or Edit Vehicle Form */}
        <form onSubmit={handleAddOrUpdateVehicle} className="mb-6 text-gray-200 space-y-4">
          <div className="flex flex-col">
            <label htmlFor="modelName" className="mb-1 font-semibold">
              Model Name
            </label>
            <input
              id="modelName"
              type="text"
              value={modelName}
              onChange={(e) => setModelName(e.target.value)}
              className="p-3 border border-gray-300 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="mfd" className="mb-1 font-semibold">
              Manufacture Date
            </label>
            <input
              id="mfd"
              type="date"
              value={mfd}
              onChange={(e) => setMfd(e.target.value)}
              className="p-3 border border-gray-300 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="price" className="mb-1 font-semibold">
              Price
            </label>
            <input
              id="price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="p-3 border border-gray-300 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="brand" className="mb-1 font-semibold">
              Brand
            </label>
            <input
              id="brand"
              type="text"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="p-3 border border-gray-300 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg transition duration-200 ease-in-out hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {selectedVehicle ? "Update Vehicle" : "Add Vehicle"}
          </button>
        </form>

        {/* Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Model Name
                  </th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    MFD
                  </th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Brand
                  </th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                {vehicles.map((vehicle) => (
                  <tr key={vehicle.vehicle_id} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                    <td className="py-3 px-6 text-sm font-medium text-gray-900 dark:text-white">
                      {vehicle.model_name}
                    </td>
                    <td className="py-3 px-6 text-sm text-gray-500 dark:text-gray-400">{vehicle.mfd}</td>
                    <td className="py-3 px-6 text-sm text-gray-500 dark:text-gray-400">{vehicle.price}</td>
                    <td className="py-3 px-6 text-sm text-gray-500 dark:text-gray-400">{vehicle.brand}</td>
                    <td className="py-3 px-6 text-sm">
                      <button
                        onClick={() => handleEdit(vehicle)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(vehicle.vehicle_id)}
                        className="ml-2 text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Vehicles;
