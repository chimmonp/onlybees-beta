import mongoose from 'mongoose';

const sectionSchema = new mongoose.Schema({
    _id: { 
        type: String,
        required: true,
        unique: true 
    },
    bowl: {
        type: String,
        required: true
    },
    entry: {
        type: String,
        required: true
    },
    gate: {
        type: String,
        required: true
    },
    availableQuantity: [
        {
            date: { type: String, required: true },
            availableQuantity: { type: Number, required: true },
        }
    ],
    price: {
        type: Number,
        required: true
    },
});

export default mongoose.models.Section || mongoose.model('Section', sectionSchema);