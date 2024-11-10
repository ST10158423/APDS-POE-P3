// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import CustomerPaymentForm from './components/CustomerPaymentForm';
import EmployeeDashboard from './components/EmployeeDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Redirect to login if no route is specified */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        {/* Only accessible by users with the "employee" role */}
        <Route
          path="/register"
          element={<ProtectedRoute component={Register} role="employee" />}
        />

        {/* Only accessible by users with the "customer" role */}
        <Route 
          path="/customer/payment" 
          element={<ProtectedRoute component={CustomerPaymentForm} role="customer" />} 
        />

        {/* Only accessible by users with the "employee" role */}
        <Route 
          path="/employee/dashboard" 
          element={<ProtectedRoute component={EmployeeDashboard} role="employee" />} 
        />
      </Routes>
    </Router>
  );
}

export default App;
