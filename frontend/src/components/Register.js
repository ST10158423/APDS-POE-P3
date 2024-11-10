// src/components/Register.js
import React, { useState } from 'react';
import { registerUser } from '../services/api';

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: '',
    idNumber: '',
    accountNumber: '',
    username: '',
    email: '',
    password: '',
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerUser(formData);
      setMessage('Registration successful!');
    } catch (err) {
      setMessage('Error during registration. Please try again.');
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <p>{message}</p>
      <form onSubmit={handleSubmit}>
        <input name="fullName" onChange={handleChange} value={formData.fullName} placeholder="Full Name" required />
        <input name="idNumber" onChange={handleChange} value={formData.idNumber} placeholder="ID Number" required />
        <input name="accountNumber" onChange={handleChange} value={formData.accountNumber} placeholder="Account Number" required />
        <input name="username" onChange={handleChange} value={formData.username} placeholder="Username" required />
        <input name="email" onChange={handleChange} value={formData.email} placeholder="Email" required />
        <input name="password" onChange={handleChange} type="password" value={formData.password} placeholder="Password" required />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}
