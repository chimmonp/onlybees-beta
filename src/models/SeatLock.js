import mongoose from 'mongoose';

const SeatLockSchema = new mongoose.Schema({
    sectionId: {
        type: String,
        ref: 'Section',
        required: true
    },
    date: {
        type: String, // Format: "aug-26"
        required: true
    },
    transactionId: {
        type: String,
        required: true
    },
    lockedSeats: {
        type: Number,
        required: true,
        min: [1, 'At least 1 seat must be locked']
    },
    lockTime: {
        type: Date,
        default: Date.now,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true
    }
});

// TTL index on the `expiresAt` field to automatically delete expired locks
// SeatLockSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.models.SeatLock || mongoose.model('SeatLock', SeatLockSchema);
