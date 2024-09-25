import mongoose from 'mongoose';

// Define the ticketPrice sub-schema
const TicketPriceSchema = new mongoose.Schema({
  ticketType: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
}, { _id: false });


const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  ticketDetails: [TicketPriceSchema], // Array of ticket types, quantities, and prices
  amount: { type: Number, required: true },
  baseAmt: { type: Number },
  convenienceFee: { type: Number },
  platformFee: { type: Number },
  currency: { type: String },
  receipt: { type: String },
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
