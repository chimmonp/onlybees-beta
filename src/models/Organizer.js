// src/models/Organizer.js
import mongoose from 'mongoose';


// Define schema for Event Organizer
const OrganizerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  phone: {
    type: Number,
    required: true,
    unique: true,
  },
  events: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  }],
  city: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
}, {
  timestamps: true
});

// Create and export the model
export default mongoose.models.Organizer || mongoose.model('Organizer', OrganizerSchema);
