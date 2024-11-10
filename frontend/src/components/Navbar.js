// src/components/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole');

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  return (
    <nav>
      <Link to="/login">Login</Link>
      
      {/* Conditionally render Register link for employees only */}
      {userRole === 'employee' && <Link to="/register">Register</Link>}

      {/* Conditionally render Make Payment link for customers */}
      {userRole === 'customer' && <Link to="/customer/payment">Make Payment</Link>}

      {/* Conditionally render Employee Dashboard link for employees */}
      {userRole === 'employee' && <Link to="/employee/dashboard">Employee Dashboard</Link>}

      {/* Logout button should only be visible if a user is logged in */}
      {userRole && <button onClick={handleLogout}>Logout</button>}
    </nav>
  );
}
