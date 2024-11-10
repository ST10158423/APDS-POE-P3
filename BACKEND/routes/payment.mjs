import express from 'express';
import rateLimit from 'express-rate-limit';
import checkAuth from './middleware/checkAuth.mjs';
import Payment from '../models/Payment.mjs';

const router = express.Router();

// Rate limiter for payment routes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  message: "Too many requests, please try again later.",
});

// Customer Payment Creation
router.post('/create-payment', checkAuth, limiter, async (req, res) => {
  if (req.user.role !== 'customer') {
    return res.status(403).json({ message: 'Access forbidden: customers only' });
  }

  const { customerName, amount, currency, provider, swiftCode, payeeAccount, orderId } = req.body;
  if (!customerName || !amount || !currency || !provider || !swiftCode || !payeeAccount || !orderId) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const newPayment = new Payment({
      customerName,
      amount,
      currency,
      provider,
      swiftCode,
      payeeAccount,
      orderId,
      status: 'Pending',
    });

    await newPayment.save();
    res.status(201).json({ message: 'Payment created successfully', payment: newPayment });
  } catch (error) {
    console.error('Error creating payment:', error);
    res.status(500).json({ message: 'Error creating payment', error: error.message });
  }
});

// Employee Payment Verification
router.patch('/verify-payment/:id', checkAuth, limiter, async (req, res) => {
  if (req.user.role !== 'employee') {
    return res.status(403).json({ message: 'Access forbidden: employees only' });
  }

  const { id } = req.params;
  try {
    const payment = await Payment.findById(id);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    payment.status = 'Verified';
    await payment.save();
    res.json({ message: 'Payment verified successfully', payment });
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ message: 'Error verifying payment', error: error.message });
  }
});

// Submit to SWIFT (mocked action)
router.post('/submit-to-swift/:id', checkAuth, async (req, res) => {
  if (req.user.role !== 'employee') {
    return res.status(403).json({ message: 'Access forbidden: employees only' });
  }

  const { id } = req.params;
  try {
    const payment = await Payment.findById(id);
    if (!payment || payment.status !== 'Verified') {
      return res.status(400).json({ message: 'Payment not verified or not found' });
    }

    console.log(`Submitting payment ${payment._id} to SWIFT...`);
    payment.status = 'Submitted to SWIFT';
    await payment.save();
    res.json({ message: 'Payment submitted to SWIFT successfully', payment });
  } catch (error) {
    console.error('Error submitting to SWIFT:', error);
    res.status(500).json({ message: 'Error submitting to SWIFT', error: error.message });
  }
});

export default router;
