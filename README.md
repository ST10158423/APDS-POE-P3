# 💻 Secure Banking Portal

A web-based banking application that supports secure transactions and role-based access for customers and employees.

## 📋 Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
  - [Customer Role](#customer-role)
  - [Employee Role](#employee-role)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

- Customer Registration & Login (Managed by Employees)
- Employee-Managed Payment Verification & Submission
- Secure Payments Submission Using SWIFT Protocol
- CSRF Protection & JWT Authentication
- Role-Based Access Control
- RESTful API Integration

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ST10158423/APDS-POE-P3
   cd secure-banking-portal
   ```

2. **Install dependencies for both frontend and backend**
   ```bash
   # For backend
   cd backend
   npm install

   # For frontend
   cd ../frontend
   npm install
   ```


3. **Run the backend server**
   ```bash
   # Navigate to backend
   cd backend

   # Start server
   npm start
   ```

4. **Run the frontend server**
   ```bash
   # Navigate to frontend
   cd ../frontend

   # Start React app
   npm start
   ```

5. **Access the application**
   - Open your browser and navigate to `https://localhost:3000`

## 👥 Usage

### Customer Role
Customers can perform the following actions:

1. **Login**: Customers can log in using their account credentials provided by the employee.
2. **Make a Payment**:
   - Navigate to the "Make Payment" page after logging in.
   - Fill in the payment details, including the amount, currency, provider, SWIFT code, and payee account.
   - Click on "Pay Now" to submit the payment.
   - Payments made will have a status of "Pending" and can only be verified by employees.

### Employee Role
Employees have the following privileges:

1. **Login**: Employees can log in using their credentials.
2. **Customer Management**:
   - Only employees can register new customers.
   - The "Register" link is accessible only to logged-in employees.
3. **Dashboard Access**:
   - Navigate to the "Employee Dashboard" after logging in.
   - View all payments made by customers.
   - **Verify Payments**: Click the "Verify" button next to a payment to verify it.
   - **Submit Payments to SWIFT**: Once payments are verified, click "Submit All Verified to SWIFT" to process payments.

## 🛠️ Technology Stack

- **Frontend**: React.js
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT
- **Security**: CSRF Protection, HTTPS, Helmet

## 🗂️ Project Structure

```
secure-banking-portal/
 ├── backend/
 │   ├── db/
 │   ├── middleware/
 │   ├── models/
 │   ├── routes/
 │   └── server.mjs
 └── frontend/
     ├── public/
     ├── src/
     │   ├── components/
     │   ├── services/
     │   └── App.js
```

## ⚙️ Environment Variables

- **PORT**: The port on which the backend server runs (default: `3001`).
- **MONGO_URI**: The URI for the MongoDB database.
- **JWT_SECRET**: Secret key for signing JWT tokens.

## 📊 API Endpoints

| Endpoint                       | Method | Description                           |
| ------------------------------ | ------ | ------------------------------------- |
| `/users/register`              | POST   | Register a new customer (employees only) |
| `/users/login`                 | POST   | Login a user                          |
| `/payments/create-payment`     | POST   | Create a payment (customers only)     |
| `/payments`                    | GET    | Fetch all payments (employees only)   |
| `/payments/:id/verify`         | PATCH  | Verify a payment by ID (employees only) |
| `/payments/submit-swift`       | POST   | Submit all verified payments to SWIFT |

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch.
3. Make your changes and commit them.
4. Push to your fork and submit a pull request.



