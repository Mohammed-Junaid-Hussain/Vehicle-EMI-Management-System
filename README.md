# Vehicle EMI Management System

## Project Overview

The **Vehicle EMI Management System** is a web application that enables users to manage vehicle loan applications and EMI payments seamlessly. It supports two roles: **Users** and **Admins**, providing tailored functionalities for each. Users can apply for loans, manage active loans, and make payments, while Admins can review loan applications, approve or reject them, and oversee system records.

---

## Key Features

### User Features
1. **Dashboard/Home Page**:
   - View next payment due date, credit score (calculated based on payments), total outstanding loan amount.
   - Access options to apply for a new loan, make a payment, view active loans, and more.
   - Widgets for EMI Calculator and recent transactions.

2. **Loan Application**:
   - Submit loan applications by specifying:
     - Vehicle details.
     - Loan amount and tenure.
   - Track the status of loan applications.

3. **Active Loans Page**:
   - View details of all ongoing loans, including remaining amount and EMI status.

4. **Payment History**:
   - Track past payments for all active loans with payment dates and amounts.

5. **EMI Calculator**:
   - A simple tool to calculate monthly EMIs based on loan amount, interest rate, and tenure.

6. **Make Payment**:
   - Easily pay EMI installments for active loans.

7. **Logout**:
   - Securely log out of the system.

---

### Admin Features
1. **Dashboard/Home Page**:
   - View total registered users, count of pending, approved, rejected, and disbursed loan applications.

2. **Loan Management**:
   - **New Loan Applications**:
     - Review pending applications.
     - Approve or reject loan applications.
   - **Approved Loan Applications**:
     - View a list of all approved applications.
   - **Rejected Loan Applications**:
     - View a list of all rejected applications.
   - **Disbursed Loan Applications**:
     - Manage disbursed loans.

3. **User Management**:
   - Access and manage registered users.

4. **Vehicle Management**:
   - View and manage vehicle details (model, brand, manufacturing date, price).

5. **Logout**:
   - Securely log out of the system.

---

## Database Schema

### 1. **Admin Table**
| Column      | Type          | Constraints                        |
|-------------|---------------|------------------------------------|
| id          | INT           | Primary Key, Auto Increment        |
| email       | VARCHAR(255)  | UNIQUE, NOT NULL                   |
| password    | VARCHAR(255)  | NOT NULL                           |
| role        | ENUM('admin') | Default: 'admin'                   |
| priority    | INT           | Default: 1                         |
| created_at  | TIMESTAMP     | Default: CURRENT_TIMESTAMP         |

### 2. **Users Table**
| Column            | Type                | Constraints                           |
|--------------------|---------------------|---------------------------------------|
| id                 | INT                | Primary Key, Auto Increment           |
| name               | VARCHAR(100)       | NOT NULL                              |
| mobileNumber       | VARCHAR(15)        | NOT NULL                              |
| panNumber          | VARCHAR(100)       | NOT NULL                              |
| dob                | DATE               | NOT NULL                              |
| email              | VARCHAR(255)       | UNIQUE, NOT NULL                      |
| password           | TEXT               | NOT NULL                              |
| address            | VARCHAR(255)       | NOT NULL                              |
| serviceType        | ENUM('Government','Private','Business') | NOT NULL  |
| monthlyIncome      | DECIMAL(10,2)      | NOT NULL                              |
| addressProofFile   | VARCHAR(255)       | NOT NULL                              |
| panFile            | VARCHAR(255)       | NOT NULL                              |
| created_at         | TIMESTAMP          | Default: CURRENT_TIMESTAMP            |
| updated_at         | TIMESTAMP          | Default: CURRENT_TIMESTAMP on update  |

### 3. **Vehicle Table**
| Column      | Type                   | Constraints                  |
|-------------|------------------------|------------------------------|
| vehicle_id  | INT                    | Primary Key, Auto Increment  |
| model_name  | VARCHAR(255)           | NOT NULL                     |
| mfd         | DATE                   | NOT NULL                     |
| price       | DECIMAL(10,2) UNSIGNED | NOT NULL                     |
| brand       | VARCHAR(255)           | NOT NULL                     |
| created_at  | TIMESTAMP              | Default: CURRENT_TIMESTAMP   |

### 4. **EMI Applications Table**
| Column              | Type                                    | Constraints                        |
|----------------------|-----------------------------------------|------------------------------------|
| id                   | INT                                    | Primary Key, Auto Increment        |
| user_id              | INT                                    | Foreign Key (references Users.id)  |
| vehicle_id           | INT                                    | Foreign Key (references Vehicle.vehicle_id) |
| loan_amount          | DECIMAL(10,2)                          | NOT NULL                           |
| emi_amount           | DECIMAL(10,2)                          | NOT NULL                           |
| tenure               | INT                                    | NOT NULL                           |
| interest_rate        | DECIMAL(5,2)                           | NOT NULL                           |
| application_status   | ENUM('Pending','Approved','Rejected')  | Default: 'Pending'                 |
| emi_status           | ENUM('Ongoing','Completed','Defaulted')| Default: 'Ongoing'                 |
| remaining_amount     | DECIMAL(10,2)                          | NOT NULL                           |
| created_at           | TIMESTAMP                              | Default: CURRENT_TIMESTAMP         |
| updated_at           | TIMESTAMP                              | Default: CURRENT_TIMESTAMP on update |

### 5. **Payments Table**
| Column              | Type          | Constraints                        |
|----------------------|---------------|------------------------------------|
| payment_id          | INT           | Primary Key, Auto Increment        |
| emi_application_id  | INT           | Foreign Key (references EMI Applications.id) |
| user_id             | INT           | Foreign Key (references Users.id)  |
| amount              | DECIMAL(10,2) | NOT NULL                           |
| payment_date        | TIMESTAMP     | Default: CURRENT_TIMESTAMP         |
| next_payment        | DATE          | NOT NULL                           |

---

## API Endpoints

### User APIs

1. **Sign-Up**
   - **Endpoint**: `/signup`
   - **Method**: `POST`
   - **Parameters**: `name`, `email`, `password`, `mobileNumber`, `panNumber`, `dob`, `address`, `serviceType`, `monthlyIncome`, `addressProofFile`, `panFile`.
   - **Response**: 
     - Success: `{"message": "User registered successfully."}`
     - Error: `{"error": "Error message..."}`

2. **Sign-In**
   - **Endpoint**: `/signin`
   - **Method**: `POST`
   - **Parameters**: `email`, `password`.
   - **Response**: 
     - Success: Redirect to dashboard.
     - Error: `{"error": "Invalid credentials."}`

3. **Apply for Loan**
   - **Endpoint**: `/apply-loan`
   - **Method**: `POST`
   - **Parameters**: `user_id`, `vehicle_id`, `loan_amount`, `tenure`.
   - **Response**: 
     - Success: `{"message": "Loan application submitted."}`
     - Error: `{"error": "Error message..."}`

4. **Make Payment**
   - **Endpoint**: `/make-payment`
   - **Method**: `POST`
   - **Parameters**: `emi_application_id`, `amount`.
   - **Response**: 
     - Success: `{"message": "Payment successful."}`
     - Error: `{"error": "Error message..."}`

---

## ER Diagram
![ER Diagram](https://github.com/YourUsername/Vehicle-EMI-Management-System/blob/main/ERDiagram.png)

---

## Setup Instructions

1. **Clone Repository**:
   ```bash
   git clone https://github.com/YourUsername/Vehicle-EMI-Management-System.git
   cd Vehicle-EMI-Management-System
2. **Install Dependencies**:
    '''bash
    npm install
   
4. **Run the Application**:

   
5. **Access the Application**:
    User Dashboard: http://localhost:3000/
    Admin Dashboard: http://localhost:3000/admin




## Screenshots

### User Pages

#### Home Page
- Displays next payment date, credit score, outstanding loans, and quick access to loan application, payment, and EMI calculator.
![User Home Page](https://github.com/YourUsername/Vehicle-EMI-Management-System/blob/main/screenshots/user-home.png)

#### Loan Application Page
- Allows users to submit a loan application by selecting a vehicle, entering loan amount, tenure, and other details.
![Loan Application Page](https://github.com/YourUsername/Vehicle-EMI-Management-System/blob/main/screenshots/loan-application.png)

#### Active Loans Page
- Lists all active loans, showing details like remaining amount, EMI status, and payment schedule.
![Active Loans Page](https://github.com/YourUsername/Vehicle-EMI-Management-System/blob/main/screenshots/active-loans.png)

#### EMI Calculator
- A simple tool to calculate estimated monthly EMIs based on loan amount, interest rate, and tenure.
![EMI Calculator](https://github.com/YourUsername/Vehicle-EMI-Management-System/blob/main/screenshots/emi-calculator.png)

#### Payment History
- Displays past payments for all active loans with transaction details such as payment date and amount.
![Payment History Page](https://github.com/YourUsername/Vehicle-EMI-Management-System/blob/main/screenshots/payment-history.png)

---

### Admin Pages

#### Admin Dashboard
- Displays an overview of the system, including total registered users, pending loan applications, approved loans, and rejected loans.
![Admin Dashboard](https://github.com/YourUsername/Vehicle-EMI-Management-System/blob/main/screenshots/admin-dashboard.png)

#### Loan Management - New Applications
- Lists all pending loan applications for admin review and action (approve or reject).
![New Loan Applications](https://github.com/YourUsername/Vehicle-EMI-Management-System/blob/main/screenshots/new-loan-applications.png)

#### Approved Loans
- Displays all loans that have been approved and are awaiting disbursement.
![Approved Loans](https://github.com/YourUsername/Vehicle-EMI-Management-System/blob/main/screenshots/approved-loans.png)

#### Rejected Loans
- Displays all loan applications that have been rejected by the admin.
![Rejected Loans](https://github.com/YourUsername/Vehicle-EMI-Management-System/blob/main/screenshots/rejected-loans.png)

#### Disbursed Loans
- Lists all loans that have been disbursed, including details of disbursement.
![Disbursed Loans](https://github.com/YourUsername/Vehicle-EMI-Management-System/blob/main/screenshots/disbursed-loans.png)

#### User Management
- Displays a list of registered users and their details for admin reference and management.
![User Management](https://github.com/YourUsername/Vehicle-EMI-Management-System/blob/main/screenshots/user-management.png)

#### Vehicle Management
- Allows the admin to view and manage details of vehicles available for loan applications.
![Vehicle Management](https://github.com/YourUsername/Vehicle-EMI-Management-System/blob/main/screenshots/vehicle-management.png)

---

### Additional Features
- **Role-Based Authentication**: Ensures that users and admins have access to only their respective pages and features.
- **Dynamic Loan Calculations**: Automatically calculates EMI amounts and outstanding balances.
- **Responsive Design**: Fully optimized for both desktop and mobile views.

---

### Acknowledgments
- Special thanks to [Your Team/Co-Contributors] for their valuable contributions to the project.

---

## Just follow me and Star ⭐ my repository!  
## Thank You!
