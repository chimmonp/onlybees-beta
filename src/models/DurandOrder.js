import mongoose from 'mongoose';

const durandOrderSchema = new mongoose.Schema({
  transactionId: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  match: { type: mongoose.Schema.Types.ObjectId, ref: 'Match', required: true },
  status: { type: String, default: 'PENDING' },
  amount: { type: Number, required: true },
  baseAmount: { type: Number, required: true },
  quantity: { type: Number, required: true },
  section: { type: String, required: true },
  currency: { type: String, required: true, default: "INR" },
  // receipt: { type: String, required: true },
  notes: { type: Map, of: String, required: false },
  createdAt: { type: Date, default: Date.now },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
});

export default mongoose.models.DurandOrder || mongoose.model('Order', durandOrderSchema);
