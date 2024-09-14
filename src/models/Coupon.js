// src/models/Coupon.js
import mongoose from 'mongoose';

// Define schema for Coupon
const CouponSchema = new mongoose.Schema({
  couponCode: {
    type: String,
    required: true,
    unique: true
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  percentageDiscount: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  expirationDate: {
    type: Date,
  },
  minPurchaseRequirement: {
    type: Number,
    default: 0 // Default to 0 if there's no minimum purchase requirement
  },
  usageLimitPerUser: {
    type: Number,
    default: 1 // Default to 1 usage per user if not specified
  },
  usageLimitTotal: {
    type: Number,
    default: 1 // Default to 1 total usage if not specified
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'expired'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true // Automatically manage createdAt and updatedAt fields
});

// Create and export the model
export default mongoose.models.Coupon || mongoose.model('Coupon', CouponSchema);
