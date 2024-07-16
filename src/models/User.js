// src/models/User.js
import mongoose from 'mongoose';

const ticketDetailSchema = new mongoose.Schema({
  ticketType: String,
  quantity: Number,
  price: Number,
}, { _id: false });

const bookingSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
  ticketDetails: [ticketDetailSchema],
  bookingDate: Date,
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  ticketId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ticket' },
  qrLink: { type: String, default: null}
}, { _id: false });

const sportsBookingSchema = new mongoose.Schema({
  match: { type: mongoose.Schema.Types.ObjectId, ref: 'Match' },
  ticket: { type: mongoose.Schema.Types.ObjectId, ref: 'DurandTickets' },
  bookingDate: Date,
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'DurandOrder' },
  qrLink: { type: String, default: null}
}, { _id: false });

const UserSchema = new mongoose.Schema({
  phone: { type: String, required: true, unique: true },
  firstname: { type: String, required: true },
  lastname: { type: String },
  email: { type: String },
  bookings: [bookingSchema], // Array of booking subdocuments
  sportsBookings: [sportsBookingSchema],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
