// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ component: Component, role, ...rest }) {
  const jwt = localStorage.getItem('jwt');
  const userRole = localStorage.getItem('userRole');

  // Check if user is authenticated and has the correct role
  if (jwt && userRole === role) {
    return <Component {...rest} />;
  }

  // Redirect to login if the user is not authorized
  return <Navigate to="/login" />;
}
