// routes/employee.mjs
import express from 'express';
import Payment from '../models/Payment.mjs'; // Import the Payment model

const router = express.Router();

// Route to fetch all payments for the employee dashboard
router.get('/payments', async (req, res) => {
  try {
    console.log("Received request to fetch all payments for employee");
    const payments = await Payment.find(); // Retrieve all payments
    if (payments.length === 0) {
      return res.status(404).json({ message: 'No payments found' });
    }
    res.status(200).json(payments);
  } catch (error) {
    console.error("Error fetching payments:", error);
    res.status(500).json({ message: 'Failed to fetch payments' });
  }
});

// Route to verify a specific payment by ID
router.patch('/payments/:id/verify', async (req, res) => {
  const { id } = req.params;
  try {
    const payment = await Payment.findById(id);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    // Update the status to 'Verified'
    payment.status = 'Verified';
    await payment.save();

    res.status(200).json({ message: 'Payment verified', payment });
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ message: 'Failed to verify payment' });
  }
});

// Route to submit verified payments to SWIFT
router.post('/payments/submit-swift', async (req, res) => {
  try {
    // Find all payments with status 'Verified'
    const verifiedPayments = await Payment.find({ status: 'Verified' });

    if (verifiedPayments.length === 0) {
      return res.status(400).json({ message: 'No verified payments to submit' });
    }

    // Here you would integrate with SWIFT API (omitted for simplicity)
    // Example: await swiftApi.submitPayments(verifiedPayments);

    // Update status of each verified payment to 'Submitted'
    for (const payment of verifiedPayments) {
      payment.status = 'Submitted';
      await payment.save();
    }

    res.status(200).json({ message: 'All verified payments submitted to SWIFT' });
  } catch (error) {
    console.error("Error submitting payments to SWIFT:", error);
    res.status(500).json({ message: 'Failed to submit payments to SWIFT' });
  }
});

export default router;
