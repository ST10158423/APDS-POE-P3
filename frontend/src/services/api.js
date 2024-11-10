import axios from 'axios';

// Create an axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://localhost:3001', // Backend base URL
  withCredentials: true, // Enable credentials for CSRF protection
});

let csrfTokenCache = null;

// Fetch CSRF token and cache it
async function getCsrfToken() {
  if (csrfTokenCache) return csrfTokenCache;
  try {
    const csrfTokenResponse = await api.get('/csrf-token');
    if (csrfTokenResponse.status === 200 && csrfTokenResponse.data.csrfToken) {
      console.log('Fetched CSRF token:', csrfTokenResponse.data.csrfToken);
      csrfTokenCache = csrfTokenResponse.data.csrfToken;
      return csrfTokenCache;
    } else {
      throw new Error("Failed to fetch CSRF token");
    }
  } catch (error) {
    console.error("Error fetching CSRF token:", error.response?.data || error.message);
    csrfTokenCache = null;
    throw error;
  }
}

// Retrieve JWT token from local storage
function getJwtToken() {
  const token = localStorage.getItem('jwt');
  if (!token) console.warn("JWT token is missing. Ensure user is logged in.");
  return token;
}

// Register User
async function registerUser(userData) {
  try {
    const csrfToken = await getCsrfToken();
    const response = await api.post('/users/register', userData, {
      headers: { 'X-CSRF-Token': csrfToken },
    });
    console.log('User registered:', response.data);
    return response.data;
  } catch (error) {
    console.error("Error registering user:", error.response?.data || error.message);
    throw error;
  }
}

// Login User
async function login(username, accountNumber, password) {
  try {
    const csrfToken = await getCsrfToken();
    const response = await api.post(
      '/users/login',
      { username, accountNumber, password },
      { headers: { 'X-CSRF-Token': csrfToken } }
    );
    console.log('Login response data:', response.data);
    return response.data;
  } catch (error) {
    console.error("Error logging in:", error.response?.data || error.message);
    throw error;
  }
}

// Create Payment for Customer
async function createPayment(paymentData) {
  try {
    const csrfToken = await getCsrfToken();
    const token = getJwtToken();
    if (!token) throw new Error("JWT token is missing. User might not be logged in.");

    const response = await api.post('/payments/create-payment', paymentData, {
      headers: {
        'X-CSRF-Token': csrfToken,
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('Payment created:', response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating payment:", error.response?.data || error.message);
    throw error;
  }
}

// Fetch Transactions for Employee Dashboard
async function fetchTransactions() {
  try {
    const csrfToken = await getCsrfToken();
    const token = getJwtToken();
    if (!token) throw new Error("JWT token is missing. User might not be logged in.");

    const response = await api.get('/employee/payments', {
      headers: {
        'X-CSRF-Token': csrfToken,
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('Fetched transactions:', response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching transactions:", error.response?.data || error.message);
    throw error;
  }
}

// Verify a Transaction (Employee only)
async function verifyTransaction(transactionId) {
  try {
    const csrfToken = await getCsrfToken();
    const token = getJwtToken();
    if (!token) throw new Error("JWT token is missing. User might not be logged in.");

    const response = await api.patch(`/employee/payments/${transactionId}/verify`, {}, {
      headers: {
        'X-CSRF-Token': csrfToken,
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('Transaction verified:', response.data);
    return response.data;
  } catch (error) {
    console.error("Error verifying transaction:", error.response?.data || error.message);
    throw error;
  }
}

// Submit all Verified Transactions to SWIFT
async function submitToSWIFT() {
  try {
    const csrfToken = await getCsrfToken();
    const token = getJwtToken();
    if (!token) throw new Error("JWT token is missing. User might not be logged in.");

    const response = await api.post('/employee/payments/submit-swift', {}, {
      headers: {
        'X-CSRF-Token': csrfToken,
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('Submitted to SWIFT:', response.data);
    return response.data;
  } catch (error) {
    console.error("Error submitting to SWIFT:", error.response?.data || error.message);
    throw error;
  }
}

// Export API instance and functions
export default api;
export {
  getCsrfToken,
  registerUser,
  login,
  createPayment,
  fetchTransactions,
  verifyTransaction,
  submitToSWIFT,
};
