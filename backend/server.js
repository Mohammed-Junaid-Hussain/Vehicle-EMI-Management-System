const express = require("express");
const mysql = require("mysql2");

const cors = require("cors");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const { body, validationResult } = require("express-validator");
require("dotenv").config();
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Connect to the database
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("MySQL connected...");
});

// Assuming this is the MySQL connection file

// Setup multer storage for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Upload directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Avoid file name duplicates
  },
});
const upload = multer({ storage });

// Ensure 'uploads' directory exists
const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

///End point for Signup
app.post(
  "/api/signup",
  upload.single("panFile"),
  [
    body("email").isEmail().withMessage("Invalid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
    body("mobileNumber")
      .isMobilePhone("any")
      .withMessage("Invalid mobile number"),
    body("panNumber").notEmpty().withMessage("PAN number is required"),
    body("address").notEmpty().withMessage("Address is required"),
    body("serviceType").notEmpty().withMessage("Service type is required"),
    body("monthlyIncome")
      .isNumeric()
      .withMessage("Monthly income must be a number"),
  ],
  async (req, res) => {
    console.log(req.body);
    console.log(req.file);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const {
        name,
        mobileNumber,
        panNumber,
        dob,
        email,
        password,
        address,
        serviceType,
        monthlyIncome,
      } = req.body;

      // Check if the email already exists
      const [results] = await db
        .promise()
        .query("SELECT * FROM users WHERE email = ?", [email]);
      if (results.length > 0) {
        return res.status(400).json({ message: "Email already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = {
        name,
        mobileNumber,
        panNumber,
        dob,
        email,
        password: hashedPassword,
        address,
        serviceType,
        monthlyIncome,
        panFile: req.file ? req.file.filename : null,
      };

      await db.promise().query("INSERT INTO users SET ?", newUser);
      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Login route
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const [results] = await db
      .promise()
      .query("SELECT * FROM Users WHERE email = ?", [email]);
    if (results.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Return user info to store in sessionStorage
    res.json({
      userId: user.id,
      userName: user.name,
      email: user.email,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Fetch user information by ID
app.get("/api/user/:id", (req, res) => {
  const userId = req.params.id;

  // Query to fetch user details
  const query = "SELECT * FROM users WHERE id = ?";
  db.query(query, [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }

    if (results.length > 0) {
      const user = results[0];
      return res.json(user);
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  });
});

// Admin login route
app.post("/api/Admin_Login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const query = "SELECT * FROM admin WHERE email = ?";
    const [results] = await db.promise().query(query, [email]);

    if (results.length === 0) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const admin = results[0];
    const match = await bcrypt.compare(password, admin.password);
    if (!match) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    res.json({ message: "Login successful", role: admin.role });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Database error" });
  }
});

// Create admin
app.post(
  "/api/createAdmin",
  [
    body("email").isEmail().withMessage("Invalid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  async (req, res) => {
    const { email, password } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const query =
        "INSERT INTO admin (email, password, role, priority) VALUES (?, ?, 'admin', 1)";
      await db.promise().query(query, [email, hashedPassword]);
      res.json({ message: "Admin created successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error creating admin" });
    }
  }
);

//TO GET LIST OF USERS
app.get("/api/users", async (req, res) => {
  try {
    const [results] = await db.promise().query("SELECT * FROM users");
    res.json(results); // Send back the list of users
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Fetch all vehicles
app.get("/api/uservehicle", (req, res) => {
  db.query("SELECT vehicle_id, model_name FROM vehicle;", (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});

// Fetch vehicle details by ID
app.get("/api/vehicle/:id", (req, res) => {
  const vehicleId = req.params.id;
  db.query(
    "SELECT vehicle_id, model_name, mfd, price, brand FROM vehicle WHERE vehicle_id = ?",
    [vehicleId],
    (err, results) => {
      if (err) {
        console.error("Database query error:", err);
        return res.status(500).json({ error: "Database error" });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: "Vehicle not found" });
      }
      res.json(results[0]);
    }
  );
});

// Submit loan application
// API to submit loan application
app.post("/api/submit-loan-application", (req, res) => {
  const { user_id, vehicle_id, loan_amount, tenure, interest_rate } = req.body;

  const emiAmount = calculateEmi(loan_amount, interest_rate, tenure);

  const query = `
    INSERT INTO emi_applications (user_id, vehicle_id, loan_amount, emi_amount, tenure, interest_rate, application_status, emi_status, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, 'Pending', 'Ongoing', NOW(), NOW())
  `;

  db.query(
    query,
    [user_id, vehicle_id, loan_amount, emiAmount, tenure, interest_rate],
    (err, result) => {
      if (err) {
        console.error("Error submitting application:", err);
        res.status(500).json({ error: "Failed to submit application" });
        return;
      }
      res.json({ success: true, applicationId: result.insertId });
    }
  );
});

// Function to calculate EMI
const calculateEmi = (loanAmount, interestRate, tenure) => {
  const monthlyRate = interestRate / 100 / 12;
  const emi =
    (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenure)) /
    (Math.pow(1 + monthlyRate, tenure) - 1);
  return emi.toFixed(2);
};
// Fetch all active loans
app.get("/api/active-loans", (req, res) => {
  const sql = `
    SELECT e.id, e.loan_amount, e.emi_amount, e.tenure, e.interest_rate, e.application_status, e.emi_status,
           u.name, u.mobileNumber, u.panNumber, u.dob, u.email, u.address, u.serviceType, u.monthlyIncome, 
           u.addressProofFile, u.panFile, v.model_name, v.vehicle_id, v.mfd, v.price, v.brand 
    FROM emi_applications e
    JOIN users u ON e.user_id = u.id
    JOIN vehicle v ON e.vehicle_id = v.vehicle_id
    WHERE e.emi_status = 'Ongoing'`;

  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error fetching active loans:", err);
      res.status(500).send("Error fetching active loans");
    } else {
      res.json(result);
    }
  });
});

// Fetch active loans for a particular user by user ID
app.get("/api/active-loans/:userId", (req, res) => {
  const userId = req.params.userId;
  const sql = `
    SELECT e.id, e.loan_amount, e.emi_amount, e.tenure, e.interest_rate, e.application_status, e.emi_status,
           u.name, u.mobileNumber, u.panNumber, u.dob, u.email, u.address, u.serviceType, u.monthlyIncome, 
           u.addressProofFile, u.panFile, v.model_name, v.vehicle_id, v.mfd, v.price, v.brand 
    FROM emi_applications e
    JOIN users u ON e.user_id = u.id
    JOIN vehicle v ON e.vehicle_id = v.vehicle_id
    WHERE e.emi_status = 'Ongoing' AND e.user_id = ?`;

  db.query(sql, [userId], (err, result) => {
    if (err) {
      console.error("Error fetching active loans for user:", err);
      res.status(500).send("Error fetching active loans for user");
    } else {
      res.json(result);
    }
  });
});

// Endpoint to fetch vehicles
app.get("/api/user-vehicles", (req, res) => {
  db.query(
    "SELECT vehicle_id, model_name, mfd, price, brand FROM vehicle",
    (err, results) => {
      if (err) {
        console.error("Database query error:", err);
        return res.status(500).json({ error: "Database error" });
      }
      res.json(results);
    }
  );
});

// Endpoint to add a vehicle
app.post("/api/vehicles", (req, res) => {
  const { model_name, mfd, price, brand } = req.body; // Add brand to destructuring
  const sql =
    "INSERT INTO vehicle (model_name, mfd, price, brand) VALUES (?, ?, ?, ?)";
  db.query(sql, [model_name, mfd, price, brand], (err, result) => {
    if (err) {
      console.error("Error inserting vehicle:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res
      .status(201)
      .json({ vehicle_id: result.insertId, model_name, mfd, price, brand }); // Include brand in response
  });
});
// Endpoint to fetch vehicles
app.get("/api/vehicles", (req, res) => {
  db.query("SELECT * FROM vehicle", (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});

// Endpoint to delete a vehicle
// Delete a vehicle
app.delete("/api/vehicles/:id", (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM vehicle WHERE vehicle_id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error deleting vehicle:", err);
      return res.status(500).json({ error: "Failed to delete vehicle" });
    }
    res.json({ message: "Vehicle deleted successfully" });
  });
});

// Endpoint to update a vehicle
// Update a vehicle
app.put("/api/vehicles/:id", (req, res) => {
  const { id } = req.params;
  const { model_name, mfd, price, brand } = req.body;

  const sql =
    "UPDATE vehicle SET model_name = ?, mfd = ?, price = ?, brand = ? WHERE vehicle_id = ?";
  db.query(sql, [model_name, mfd, price, brand, id], (err, result) => {
    if (err) {
      console.error("Error updating vehicle:", err);
      return res.status(500).json({ error: "Failed to update vehicle" });
    }
    res.json({ message: "Vehicle updated successfully" });
  });
});

// Define Admin details endpoint
app.get("/api/admin-details/:id", (req, res) => {
  const adminId = req.params.id;

  // Query to get total registered users
  const totalUsersQuery = "SELECT COUNT(*) AS totalRegisteredUsers FROM users";

  // Query for different loan application statuses
  const newLoanQuery =
    "SELECT COUNT(*) AS newLoanApps FROM emi_applications WHERE created_at = (SELECT MAX(created_at) FROM emi_applications)";
  const approvedLoanQuery =
    "SELECT COUNT(*) AS approvedLoanApps FROM emi_applications WHERE application_status = 'Approved'";
  const rejectedLoanQuery =
    "SELECT COUNT(*) AS rejectedLoanApps FROM emi_applications WHERE application_status = 'Rejected'";
  const disbursedLoanQuery =
    "SELECT COUNT(*) AS disbursedLoanApps FROM emi_applications WHERE emi_status = 'Completed'";

  const adminQuery = `SELECT * FROM admin WHERE id = ?`;

  db.query(adminQuery, [adminId], (error, adminResults) => {
    if (error) {
      console.error("Error fetching admin details:", error);
      return res.status(500).json({ message: "Internal server error" });
    }

    if (adminResults.length === 0) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const adminEmail = adminResults[0].email;

    db.query(totalUsersQuery, (error, userResults) => {
      if (error) {
        console.error("Error fetching total registered users:", error);
        return res.status(500).json({ message: "Internal server error" });
      }

      const totalRegisteredUsers = userResults[0].totalRegisteredUsers;

      // Fetch loan application metrics
      db.query(newLoanQuery, (error, newLoanResults) => {
        if (error) {
          console.error("Error fetching new loan applications:", error);
          return res.status(500).json({ message: "Internal server error" });
        }

        const newLoanApps = newLoanResults[0].newLoanApps;

        db.query(approvedLoanQuery, (error, approvedLoanResults) => {
          if (error) {
            console.error("Error fetching approved loans:", error);
            return res.status(500).json({ message: "Internal server error" });
          }

          const approvedLoanApps = approvedLoanResults[0].approvedLoanApps;

          db.query(rejectedLoanQuery, (error, rejectedLoanResults) => {
            if (error) {
              console.error("Error fetching rejected loans:", error);
              return res.status(500).json({ message: "Internal server error" });
            }

            const rejectedLoanApps = rejectedLoanResults[0].rejectedLoanApps;

            db.query(disbursedLoanQuery, (error, disbursedLoanResults) => {
              if (error) {
                console.error("Error fetching disbursed loans:", error);
                return res
                  .status(500)
                  .json({ message: "Internal server error" });
              }

              const disbursedLoanApps =
                disbursedLoanResults[0].disbursedLoanApps;

              const adminInfo = {
                email: adminEmail,
                totalRegisteredUsers,
                newLoanApps,
                approvedLoanApps,
                rejectedLoanApps,
                disbursedLoanApps,
              };

              res.json(adminInfo);
            });
          });
        });
      });
    });
  });
});

// Fetch all loan details
app.get("/api/loan-details", (req, res) => {
  const sql = `
    SELECT e.id, e.loan_amount, e.emi_amount, e.tenure, e.interest_rate, e.application_status, e.emi_status,
           u.name, u.mobileNumber, u.panNumber, u.dob, u.email, u.address, u.serviceType, u.monthlyIncome, 
           u.addressProofFile, u.panFile, v.model_name, v.vehicle_id, v.mfd, v.price, v.brand 
    FROM emi_applications e
    JOIN users u ON e.user_id = u.id
    JOIN vehicle v ON e.vehicle_id = v.vehicle_id`;

  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error fetching loan details:", err);
      res.status(500).send("Error fetching loan details");
    } else {
      res.json(result);
    }
  });
});

// Update loan application status (Approve/Reject)
app.put("/api/loan-status/:id", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const sql = "UPDATE emi_applications SET application_status = ? WHERE id = ?";

  db.query(sql, [status, id], (err, result) => {
    if (err) {
      console.error("Error updating loan status:", err);
      res.status(500).send("Error updating loan status");
    } else {
      res.send("Loan status updated successfully");
    }
  });
});

// Endpoint to fetch EMI application details
app.get("/api/emi-details/:userId", (req, res) => {
  const userId = req.params.userId;
  const query = `
    SELECT 
      e.id as application_id,
      e.loan_amount,
      e.emi_amount,
      e.tenure,
      e.interest_rate,
      e.application_status,
      e.emi_status,
      v.model_name,
      v.brand
    FROM emi_applications e
    JOIN vehicle v ON e.vehicle_id = v.vehicle_id
    WHERE e.user_id = ? AND e.application_status = 'Approved'
  `;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching EMI details:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});

// Endpoint to process EMI payment
app.post("/api/process-payment", (req, res) => {
  const { emi_application_id, user_id, payment_amount, payment_mode } =
    req.body;

  const payment = {
    emi_application_id,
    user_id,
    payment_amount,
    payment_mode,
    payment_date: new Date(),
    status: "Pending",
    created_at: new Date(),
    updated_at: new Date(),
  };

  db.query("INSERT INTO payments SET ?", payment, (err, result) => {
    if (err) {
      console.error("Error processing payment:", err);
      return res.status(500).json({ error: "Payment processing failed" });
    }

    // Simulate payment processing
    setTimeout(() => {
      const paymentId = result.insertId;
      const status = "Success"; // In real-world, this would depend on payment gateway response

      db.query(
        "UPDATE payments SET status = ? WHERE payment_id = ?",
        [status, paymentId],
        (updateErr) => {
          if (updateErr) {
            console.error("Error updating payment status:", updateErr);
            return res
              .status(500)
              .json({ error: "Payment status update failed" });
          }

          res.json({
            message: "Payment processed successfully",
            payment_id: paymentId,
            status: status,
          });
        }
      );
    }, 2000); // Simulated 2-second processing time
  });
});

// Route to fetch EMI applications
app.get("/api/emi-applications/:userId", (req, res) => {
  const userId = req.params.userId;

  const sql = `
    SELECT e.id, e.loan_amount, e.emi_amount, e.tenure, e.interest_rate, e.application_status, e.emi_status,
           e.loan_amount - IFNULL((SELECT SUM(amount) FROM payments WHERE emi_application_id = e.id), 0) AS remaining_amount,
           (SELECT p.next_payment FROM payments p WHERE p.emi_application_id = e.id ORDER BY p.payment_date DESC LIMIT 1) AS next_payment_due
    FROM emi_applications e
    WHERE e.user_id = ? AND e.application_status = 'Approved'`;

  db.query(sql, [userId], (err, result) => {
    if (err) {
      console.error("Error fetching EMI applications for user:", err);
      res.status(500).send("Error fetching EMI applications for user");
    } else {
      res.json(result);
    }
  });
});

// Route to make a payment
app.post("/api/payments", (req, res) => {
  const { emi_application_id, user_id, amount } = req.body;

  // Validate required parameters
  if (!emi_application_id || !user_id || !amount) {
    console.error("Missing required parameters:", req.body);
    return res.status(400).json({ error: "Missing required parameters" });
  }

  // Query to retrieve the EMI application
  const sqlGetEmi = `
    SELECT e.id, e.loan_amount, e.emi_amount, e.tenure, e.interest_rate, e.application_status, e.emi_status,
           e.loan_amount - IFNULL((SELECT SUM(amount) FROM payments WHERE emi_application_id = e.id), 0) AS remaining_amount,
           (SELECT COUNT(*) FROM payments WHERE emi_application_id = e.id) AS payment_count
    FROM emi_applications e
    WHERE e.id = ? AND e.user_id = ? AND e.application_status = 'Approved' AND e.emi_status = 'Ongoing'`;

  db.query(sqlGetEmi, [emi_application_id, user_id], (err, results) => {
    if (err) {
      console.error("Error retrieving EMI application:", err);
      return res.status(500).json({ error: err.message });
    }

    // Check if any matching EMI application was found
    if (results.length === 0) {
      console.error("No matching EMI application found:", {
        emi_application_id,
        user_id,
      });
      return res.status(400).json({ error: "Invalid or inactive EMI application." });
    }

    const emi = results[0];
    const paymentAmount = Math.min(amount, emi.remaining_amount);
    const updatedRemainingAmount = emi.remaining_amount - paymentAmount;
    const newEmiStatus = updatedRemainingAmount === 0 ? "Completed" : "Ongoing";

    // Calculate the next payment date based on the number of previous payments
    const nextPaymentDate = new Date();
    const paymentCount = emi.payment_count; // Get the number of payments made so far
    const daysToAdd = (paymentCount + 1) * 30; // Increment by 30 days for each payment
    nextPaymentDate.setDate(nextPaymentDate.getDate() + daysToAdd);

    // Insert the payment record
    db.query(
      "INSERT INTO payments (emi_application_id, user_id, amount, next_payment) VALUES (?, ?, ?, ?)",
      [emi_application_id, user_id, paymentAmount, nextPaymentDate],
      (err, paymentResult) => {
        if (err) {
          console.error("Error recording payment:", err);
          return res.status(500).json({ error: err.message });
        }

        // Update the remaining amount and EMI status in the emi_applications table
        db.query(
          "UPDATE emi_applications SET remaining_amount = ?, emi_status = ?, updated_at = ? WHERE id = ?",
          [updatedRemainingAmount, newEmiStatus, new Date(), emi_application_id],
          (err) => {
            if (err) {
              console.error("Error updating EMI status:", err);
              return res.status(500).json({ error: err.message });
            }

            // Respond with success message
            res.json({ message: "Payment successful!", next_payment: nextPaymentDate });
          }
        );
      }
    );
  });
});


// Get all loan applications
app.get("/api/loan-requests", (req, res) => {
  db.query("SELECT * FROM emi_applications", (error, rows) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(rows);
  });
});

// Get all loan payments for a specific user
app.get("/api/loan-payments", (req, res) => {
  const userId = req.query.userId; // Get userId from query params
  db.query(
    `SELECT p.*, e.*, v.model_name, v.brand 
     FROM payments p 
     JOIN emi_applications e ON p.emi_application_id = e.id 
     JOIN vehicle v ON e.vehicle_id = v.vehicle_id 
     WHERE p.user_id = ?`,
    [userId],
    (error, rows) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: "Database error" });
      }
      res.json(rows);
    }
  );
});

// Update loan application status (Approve/Reject)
app.put("/api/loan-status/:id", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const sql = "UPDATE emi_applications SET application_status = ? WHERE id = ?";

  db.query(sql, [status, id], (err, result) => {
    if (err) {
      console.error("Error updating loan status:", err);
      return res.status(500).send("Error updating loan status");
    }
    res.send("Loan status updated successfully");
  });
});


// Fetch approved EMI applications with user and EMI details
app.get("/api/approved-emi-applications", (req, res) => {
  const query = `
      SELECT 
    emi_applications.id AS application_id,
    CAST(emi_applications.loan_amount AS DECIMAL(10, 2)) AS loan_amount,
    CAST(emi_applications.emi_amount AS DECIMAL(10, 2)) AS emi_amount,
    emi_applications.tenure,
    emi_applications.interest_rate,
    emi_applications.application_status,
    emi_applications.emi_status,
    CAST(emi_applications.remaining_amount AS DECIMAL(10, 2)) AS remaining_amount,
    emi_applications.created_at,
    emi_applications.updated_at,
    users.id AS user_id,
    users.name AS user_name,
    users.email AS user_email,
    users.mobileNumber AS user_mobile,
    users.address AS user_address,
    users.serviceType,
    users.monthlyIncome,
    payments.amount AS last_payment_amount,
    payments.payment_date AS last_payment_date,
    payments.next_payment AS next_payment_date
FROM emi_applications
JOIN users ON emi_applications.user_id = users.id
LEFT JOIN payments ON emi_applications.id = payments.emi_application_id
WHERE emi_applications.application_status = 'Approved'
ORDER BY emi_applications.id;

  `;

  db.query(query, (error, results) => {
    if (error) throw error;

    // Formatting data for response
    const formattedResults = results.reduce((acc, row) => {
      const {
        application_id,
        loan_amount,
        emi_amount,
        tenure,
        interest_rate,
        application_status,
        emi_status,
        remaining_amount,
        created_at,
        updated_at,
        user_id,
        user_name,
        user_email,
        user_mobile,
        user_address,
        serviceType,
        monthlyIncome,
        last_payment_amount,
        last_payment_date,
        next_payment_date,
      } = row;

      // Create an application entry if it doesn't already exist
      if (!acc[application_id]) {
        acc[application_id] = {
          application_id,
          loan_amount,
          emi_amount,
          tenure,
          interest_rate,
          application_status,
          emi_status,
          remaining_amount,
          created_at,
          updated_at,
          user: {
            user_id,
            user_name,
            user_email,
            user_mobile,
            user_address,
            serviceType,
            monthlyIncome,
          },
          payments: [],
        };
      }

      // Append payment details
      acc[application_id].payments.push({
        last_payment_amount,
        last_payment_date,
        next_payment_date,
      });

      return acc;
    }, {});

    res.json(Object.values(formattedResults));
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
