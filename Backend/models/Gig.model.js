import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    freelancer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    client: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

const gigSchema = new mongoose.Schema(
  {
    client: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    skillsRequired: [{ type: String }],
    budget: { type: Number, required: true },
    location: { type: String },

    appliedFreelancers: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        status: {
          type: String,
          enum: ["Pending", "Accepted", "Rejected", "Completed"],
          default: "Pending",
        },
      },
    ],

    assignedFreelancer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    status: {
      type: String,
      enum: ["Open", "In Progress", "Completed"],
      default: "Open",
    },

    isPaid: { type: Boolean, default: false },  

    reviews: [reviewSchema],
  },
  { timestamps: true }
);


export const Gig = mongoose.model("Gig", gigSchema);
