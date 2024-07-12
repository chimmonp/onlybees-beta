// models/Email.js

import mongoose from 'mongoose';

const EmailSchema = new mongoose.Schema({
    email: { type: String, required: true },
});

export default mongoose.models.Email || mongoose.model('Email', EmailSchema);