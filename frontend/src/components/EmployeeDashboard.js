// src/components/EmployeeDashboard.js
import React, { useEffect, useState } from 'react';
import { fetchTransactions, verifyTransaction, submitToSWIFT } from '../services/api';

export default function EmployeeDashboard() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setMessage(''); // Clear any existing messages
        console.log("Fetching transactions...");
        const data = await fetchTransactions();
        setPayments(data);
        console.log("Transactions fetched successfully:", data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching payments:', error);
        setMessage('Failed to load payments. Please try again later.');
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleVerify = async (id) => {
    try {
      await verifyTransaction(id);
      setPayments((prev) => prev.map((p) => (p._id === id ? { ...p, status: 'Verified' } : p)));
      setMessage('Payment verified successfully.');
    } catch (error) {
      console.error('Error verifying payment:', error);
      setMessage('Failed to verify payment. Please try again.');
    }
  };

  const handleSubmitToSWIFT = async () => {
    try {
      await submitToSWIFT();
      alert('All verified payments have been submitted to SWIFT successfully');
      setPayments((prev) => prev.map((p) => (p.status === 'Verified' ? { ...p, status: 'Submitted' } : p)));
    } catch (error) {
      console.error('Error submitting to SWIFT:', error);
      setMessage('Failed to submit to SWIFT. Please try again.');
    }
  };

  return (
    <div>
      <h2>Payment Dashboard</h2>
      {loading ? (
        <p>Loading payments...</p>
      ) : (
        <div>
          {message && <p style={{ color: 'red' }}>{message}</p>}
          {payments.length === 0 ? (
            <p>No payments found.</p>
          ) : (
            payments.map((payment) => (
              <div key={payment._id} style={{ border: '1px solid #ddd', marginBottom: '10px', padding: '10px' }}>
                <p>Customer: {payment.customerName}</p>
                <p>Amount: {payment.amount}</p>
                <p>Currency: {payment.currency}</p>
                <p>Status: {payment.status}</p>
                {payment.status === 'Pending' && (
                  <button onClick={() => handleVerify(payment._id)}>Verify</button>
                )}
              </div>
            ))
          )}
          <button onClick={handleSubmitToSWIFT} style={{ marginTop: '20px' }}>
            Submit All Verified to SWIFT
          </button>
        </div>
      )}
    </div>
  );
}
