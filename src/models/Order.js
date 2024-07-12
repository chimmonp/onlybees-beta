import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  receipt: { type: String, required: true },
  status: { type: String, default: 'created' },
  paymentId: { type: String },
  orderId: { type: String, required: true },
  notes: { type: Map, of: String },
  createdAt: { type: Date, default: Date.now },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
});

export default mongoose.models.Order || mongoose.model('Order', orderSchema);
