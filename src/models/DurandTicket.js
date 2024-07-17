import mongoose from 'mongoose';

const durandTicketSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    match: { type: mongoose.Schema.Types.ObjectId, ref: 'Match', required: true },
    section: { type: String, required: true },
    gate: { type: String, required: true},
    entry: { type: String },
    quantity: { type: Number, required: true },
    amount: { type: Number, required: true },
    bookingDate: { type: Date, default: Date.now },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'DurandOrder', required: true },
    qrLink: { type: String, default: null },
    isUsed: { type: Boolean, default: false },
});

export default mongoose.models.DurandTicket || mongoose.model('DurandTicket', durandTicketSchema);
