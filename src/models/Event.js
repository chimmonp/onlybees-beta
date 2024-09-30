import mongoose from 'mongoose';


// Define the ticketPrice sub-schema
const TicketPriceSchema = new mongoose.Schema({
    quantity: {
        type: Number,
        required: true,
    },
    maxPerUser: {
        type: Number,
    },
    price: {
        type: Number,
        required: true,
    },
    coverCharge: {
        type: Number,
        required: false,
    },
    info: {
        type: String,
        required: false,
    },
}, { _id: false }); // Disable automatic _id generation for sub-documents



const EventSchema = new mongoose.Schema({
    organizer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organizer'
    },
    title: {
        type: String,
        required: true,
    },
    about: {
        type: String,
        required: true,
    },
    venue: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    time: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        required: true,
    },
    public_id: {
        type: String,
        required: true,
    },
    ticketPrice: {
        type: Map,
        of: TicketPriceSchema, // Use Map to allow dynamic keys for ticket phases
        required: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
    },
    totalSales: {
        type: Number,
        default: 0,
    },
    ticketsSold: {
        type: Number,
        default: 0,
    }
});


// Middleware to generate slug from title before saving
EventSchema.pre('save', function (next) {
    if (this.isModified('title') || this.isNew) {
      this.slug = this.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }
    next();
  });
  
  export default mongoose.models.Event || mongoose.model('Event', EventSchema);
  
