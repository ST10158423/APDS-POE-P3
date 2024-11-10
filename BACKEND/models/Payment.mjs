import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  provider: { type: String, default: 'SWIFT' },
  swiftCode: { type: String, required: true },
  payeeAccount: { type: String, required: true },
  orderId: { type: String, required: true, unique: true },
  status: { type: String, default: 'Pending' },
  createdAt: { type: Date, default: Date.now },
});

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;