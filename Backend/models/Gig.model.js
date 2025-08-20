import mongoose from "mongoose";

const gigSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  skillsRequired: [{ type: String }],
  budget: { type: Number, required: true },
  location: { type: String },
  status: { type: String, default: "Open" },
  appliedFreelancers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  assignedFreelancer: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
,
}, { timestamps: true });

export const Gig = mongoose.model("Gig", gigSchema);
