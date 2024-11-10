// src/components/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api';

export default function Login() {
  const [username, setUsername] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setErrorMessage('');

    try {
      // Call login API with the collected credentials
      const result = await login(username, accountNumber, password);
      console.log('Login result:', result);

      if (result?.token) {
        // Store JWT and role in localStorage for session management
        localStorage.setItem('jwt', result.token);
        localStorage.setItem('userRole', result.role);

        // Clear message and redirect based on role
        setMessage('');
        if (result.role === 'employee') {
          navigate('/employee/dashboard'); // Updated path for EmployeeDashboard
        } else if (result.role === 'customer') {
          navigate('/customer/payment'); // Redirect to customer payment page
        } else {
          setMessage('Unknown user role');
        }
      } else {
        // Display error message from backend response
        setErrorMessage(result.message || 'Unexpected error. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage(
        error.response?.data?.message || 'Error logging in. Please check your credentials and try again.'
      );
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
        />
        <input
          type="text"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
          placeholder="Account Number"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
