import React, { useEffect, useState, forwardRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Line } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import UserDashboard from "./UserSidebar";

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

// Validation schema using yup
const schema = yup.object().shape({
  vehicle_id: yup.string().required("Please select a vehicle"),
  loan_amount: yup
    .number()
    .min(1, "Loan amount must be greater than 0")
    .required(),
  tenure: yup
    .number()
    .min(12, "Tenure must be at least 12 months")
    .max(84, "Tenure can be up to 84 months")
    .required(),
  interest_rate: yup
    .number()
    .min(0.1, "Interest rate must be between 0 and 30%")
    .max(30)
    .required(),
});

const EMICalculator = () => {
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      vehicle_id: "",
      loan_amount: 100000,
      tenure: 36,
      interest_rate: 5,
      emi_amount: "",
    },
  });

  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicleDetails, setSelectedVehicleDetails] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const formData = watch();

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/user-vehicles");
        if (!response.ok) {
          const text = await response.text();
          throw new Error(`HTTP error! status: ${response.status} - ${text}`);
        }
        const data = await response.json();
        console.log("Received vehicles data:", data);
        setVehicles(data);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      }
    };

    fetchVehicles();
  }, []);

  const fetchVehicleDetails = async (vehicleId) => {
    try {
      console.log("Fetching details for vehicle ID:", vehicleId); // Check vehicleId
      const response = await fetch(
        `http://localhost:5000/api/vehicle/${vehicleId}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Fetched vehicle details:", data); // Log received data
      setSelectedVehicleDetails(data);
    } catch (error) {
      console.error("Error fetching vehicle details:", error);
      setSelectedVehicleDetails(null);
    }
  };

  useEffect(() => {
    const { loan_amount, interest_rate, tenure } = formData;

    if (loan_amount && interest_rate && tenure) {
      const principal = parseFloat(loan_amount);
      const rate = parseFloat(interest_rate) / 100 / 12;
      const time = parseInt(tenure);

      const emi =
        (principal * rate * Math.pow(1 + rate, time)) /
        (Math.pow(1 + rate, time) - 1);
      setValue("emi_amount", emi.toFixed(2));

      const newChartData = [];
      let balance = principal;
      let totalInterest = 0;

      for (let month = 1; month <= time; month++) {
        const interest = balance * rate;
        const principalPaid = emi - interest;
        balance -= principalPaid;
        totalInterest += interest;

        newChartData.push({
          month,
          balance: Math.max(balance, 0),
          principalPaid,
          interest,
        });
      }

      setChartData(newChartData);
    }
  }, [formData.loan_amount, formData.interest_rate, formData.tenure, setValue]);
  

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6 flex overflow-hidden">
        <UserDashboard />
      <div className="flex-1 bg-slate-800 rounded-lg shadow-lg p-6 overflow-y-auto">
        <h2 className="text-2xl font-semibold text-white mb-4">
          Vehicle EMI Calculator 
        </h2>

        <form>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              name="vehicle_id"
              control={control}
              render={({ field }) => (
                <FormSelect
                  {...field}
                  label="Select Vehicle"
                  options={[
                    { value: "", label: "Select a vehicle" },
                    ...vehicles.map((vehicle) => ({
                      value: vehicle.vehicle_id,
                      label: vehicle.model_name,
                    })),
                  ]}
                  error={errors.vehicle_id}
                  onChange={(e) => {
                    field.onChange(e);
                    console.log("Selected vehicle ID:", e.target.value); // Log the selected value
                    if (e.target.value) {
                      fetchVehicleDetails(e.target.value);
                    } else {
                      setSelectedVehicleDetails(null);
                    }
                  }}
                />
              )}
            />

            <Controller
              name="loan_amount"
              control={control}
              render={({ field }) => (
                <FormInput
                  {...field}
                  label="Loan Amount"
                  type="number"
                  error={errors.loan_amount}
                />
              )}
            />
          </div>

          {/* Vehicle Details Section */}
          {selectedVehicleDetails && (
            <div className="mt-4 p-4 bg-slate-700 rounded-md">
              <h3 className="text-lg font-semibold mb-2">Vehicle Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label="Model Name"
                  value={selectedVehicleDetails.model_name || "N/A"}
                  readOnly
                />
                <FormInput
                  label="Manufacturing Date"
                  value={selectedVehicleDetails.mfd || "N/A"}
                  type="text"
                  readOnly
                />
                <FormInput
                  label="Price"
                  value={selectedVehicleDetails.price || "N/A"}
                  type="number"
                  readOnly
                />
                <FormInput
                  label="Brand"
                  value={selectedVehicleDetails.brand || "N/A"}
                  readOnly
                />
              </div>
            </div>
          )}

          {/* Other form fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Controller
              name="tenure"
              control={control}
              render={({ field }) => (
                <FormInput
                  {...field}
                  label="Tenure (months)"
                  type="number"
                  error={errors.tenure}
                />
              )}
            />

            <Controller
              name="interest_rate"
              control={control}
              render={({ field }) => (
                <FormInput
                  {...field}
                  label="Interest Rate (%)"
                  type="number"
                  step="0.1"
                  error={errors.interest_rate}
                />
              )}
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-slate-300 mb-1">
              EMI Amount
            </label>
            <input
              readOnly
              value={formatCurrency(formData.emi_amount)}
              className="w-full p-2 border border-slate-600 bg-slate-700 text-white rounded-md"
            />
          </div>

          <button
            className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-md"
          >
            Calculate EMI
          </button>

        </form>

        {chartData.length > 0 && (
          <div className="mt-8">
            <Line
              data={{
                labels: chartData.map((data) => `Month ${data.month}`),
                datasets: [
                  {
                    label: "Remaining Balance",
                    data: chartData.map((data) => data.balance),
                    borderColor: "#3b82f6",
                    fill: false,
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    display: true,
                  },
                },
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

const FormInput = forwardRef(({ label, type, error, ...field }, ref) => (
  <div>
    <label className="block text-sm font-medium text-slate-300 mb-1">
      {label}
    </label>
    <input
      {...field}
      ref={ref}
      type={type}
      className={`w-full p-2 border border-slate-600 bg-slate-700 text-white rounded-md ${
        error ? "border-red-500" : ""
      } ${field.readOnly ? "cursor-not-allowed opacity-70" : ""}`}
    />
    {error && <p className="text-red-500 text-sm">{error.message}</p>}
  </div>
));

const FormSelect = forwardRef(({ label, options, error, ...field }, ref) => (
  <div>
    <label className="block text-sm font-medium text-slate-300 mb-1">
      {label}
    </label>
    <select
      {...field}
      ref={ref}
      className={`w-full p-2 border border-slate-600 bg-slate-700 text-white rounded-md ${
        error ? "border-red-500" : ""
      }`}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    {error && <p className="text-red-500 text-sm">{error.message}</p>}
  </div>
));

export default EMICalculator;
