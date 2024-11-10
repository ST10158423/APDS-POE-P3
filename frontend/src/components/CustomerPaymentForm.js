// src/components/CustomerPaymentForm.js
import React, { useState } from 'react';
import { createPayment } from '../services/api';

export default function CustomerPaymentForm() {
  const [formData, setFormData] = useState({
    customerName: '', // Adding customerName field to match backend requirements
    amount: '',
    currency: 'ZAR',
    provider: 'SWIFT',
    swiftCode: '',
    payeeAccount: '',
    orderId: '', // Adding orderId to match backend requirements
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createPayment(formData);
      setMessage('Payment submitted successfully.');
    } catch (error) {
      console.error('Error submitting payment:', error);
      setMessage('Payment submission failed.');
    }
  };

  return (
    <div>
      <h2>Make a Payment</h2>
      <p>{message}</p>
      <form onSubmit={handleSubmit}>
        <input name="customerName" onChange={handleChange} value={formData.customerName} placeholder="Customer Name" required />
        <input name="amount" onChange={handleChange} type="number" value={formData.amount} placeholder="Amount" required />
        <input name="currency" onChange={handleChange} value={formData.currency} placeholder="Currency" required />
        <input name="provider" onChange={handleChange} value={formData.provider} placeholder="Provider" required />
        <input name="swiftCode" onChange={handleChange} value={formData.swiftCode} placeholder="SWIFT Code" required />
        <input name="payeeAccount" onChange={handleChange} value={formData.payeeAccount} placeholder="Payee Account" required />
        <input name="orderId" onChange={handleChange} value={formData.orderId} placeholder="Order ID" required />
        <button type="submit">Pay Now</button>
      </form>
    </div>
  );
}
