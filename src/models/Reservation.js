const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  transactionId: {
    type: String,
    required: true
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  table_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Table',
    required: true
  },
  section_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RestaurantSection',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  start_time: {
    type: Number,
    required: true
  },
  end_time: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    required: true
  },
  notes: {
    type: String,
    required: false
  },
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

// Middleware to update the `updated_at` field
reservationSchema.pre('save', function (next) {
  this.updated_at = Date.now();
  next();
});

export default mongoose.models.Reservation || mongoose.model('Reservation', reservationSchema);
