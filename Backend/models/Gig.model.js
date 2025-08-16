import mongoose from "mongoose";

const GigSchema = new mongoose.Schema({
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    skillsRequired: [String],
    budget: Number,
    location: String,
    status: { type: String, enum: ['Open', 'In Progress', 'Completed'], default: 'Open' }
}, { timestamps: true });

export const Gig = mongoose.model('Gig', GigSchema);
