import mongoose from 'mongoose';

// Define the ticketPrice sub-schema
const TicketPriceSchema = new mongoose.Schema({
    ticketType: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
}, { _id: false });

const ticketSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    ticketDetails: [TicketPriceSchema], // Array of ticket types, quantities, and prices
    bookingDate: { type: Date, default: Date.now },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    qrLink: { type: String, default: null },
    isUsed: { type: Boolean, default: false }, //To implement QR scanning
});

export default mongoose.models.Ticket || mongoose.model('Ticket', ticketSchema);
