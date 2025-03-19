import mongoose from 'mongoose';

const RSVPSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Use existing model if already defined to prevent recompilation issues in development
export default mongoose.models.RSVP || mongoose.model('RSVP', RSVPSchema);