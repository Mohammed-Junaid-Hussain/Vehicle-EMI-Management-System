// src/VehicleSelect.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const VehicleSelect = () => {
  const [vehicles, setVehicles] = useState([]); // State to hold vehicle data
  const [loading, setLoading] = useState(true); // State to manage loading status
  const [formData, setFormData] = useState({
    vehicle: ''
  });

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/vehicle'); // Adjust the URL to match your backend
        console.log('API Response:', response.data); // Log the response
        setVehicles(response.data); // Set the vehicles state
      } catch (error) {
        console.error('Error fetching vehicles:', error);
      } finally {
        setLoading(false); // Set loading to false
      }
    };

    fetchVehicles(); // Call the fetch function on component mount
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div>
      <label htmlFor="vehicle" className="block text-sm font-medium text-slate-700">
        Choose a vehicle
      </label>
      <select
        id="vehicle"
        name="vehicle"
        required
        value={formData.vehicle}
        onChange={handleChange}
        className="bg-slate-50 border border-slate-300 text-slate-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
      >
        <option value="">Choose a vehicle</option>
        {loading ? (
          <option value="" disabled>Loading...</option>
        ) : vehicles.length > 0 ? (
          vehicles.map((vehicle) => (
            <option key={vehicle.vehicle_id} value={vehicle.model_name}>
              {vehicle.model_name} - ${vehicle.price}
            </option>
          ))
        ) : (
          <option value="" disabled>No vehicles available</option>
        )}
      </select>
    </div>
  );
};

export default VehicleSelect;
