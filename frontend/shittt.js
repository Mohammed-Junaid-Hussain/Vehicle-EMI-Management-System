const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const { body, validationResult } = require("express-validator");
require("dotenv").config();

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

const fs = require("fs");
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

    res.json({ message: "Login successful", userId: user.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
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

// Endpoint to delete a vehicle
app.delete("/api/vehicles/:id", (req, res) => {
  const vehicleId = req.params.id;
  const sql = "DELETE FROM vehicle WHERE vehicle_id = ?";
  db.query(sql, [vehicleId], (err, result) => {
    if (err) {
      console.error("Error deleting vehicle:", err);
      return res.status(500).json({ error: "Database error" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Vehicle not found" });
    }
    res.status(204).send(); // No content to send back
  });
});

// Endpoint to update a vehicle
app.put("/api/vehicles/:id", (req, res) => {
  const vehicleId = req.params.id;
  const { model_name, mfd, price, brand } = req.body; // Include brand

  const sql =
    "UPDATE vehicle SET model_name = ?, mfd = ?, price = ?, brand = ? WHERE vehicle_id = ?";
  db.query(sql, [model_name, mfd, price, brand, vehicleId], (err, result) => {
    if (err) {
      console.error("Error updating vehicle:", err);
      return res.status(500).json({ error: "Database error" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Vehicle not found" });
    }
    res
      .status(200)
      .json({ vehicle_id: vehicleId, model_name, mfd, price, brand }); // Return the updated vehicle
  });
});

// Define Admin details endpoint
app.get("/api/admin-details", (req, res) => {
  // Query to get total registered users
  const totalUsersQuery = "SELECT COUNT(*) AS totalRegisteredUsers FROM users";

  db.query(totalUsersQuery, (error, results) => {
    if (error) {
      console.error("Error fetching total registered users:", error);
      return res.status(500).json({ message: "Internal server error" });
    }

    const totalRegisteredUsers = results[0].totalRegisteredUsers;

    // Here you can add logic to fetch admin details if necessary
    const adminInfo = {
      email: "admin@example.com", // Replace with actual admin email
      totalRegisteredUsers,
    };

    res.json(adminInfo);
  });
});



// Serve the client
app.use(express.static("client/build"));

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
