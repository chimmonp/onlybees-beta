import mongoose from 'mongoose';

const matchSchema = new mongoose.Schema({
    date: { type: Date, required: true, default: Date.now() },
    teamA: { type: String, required: true },
    teamB: { type: String, required: true },
    matchNo: { type: Number, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    slug: { type: String, required: true },
    sold: { type: Number, required: true },
    totalSales: { type: Number, required: true },
});

export default mongoose.models.Match || mongoose.model('Match', matchSchema);