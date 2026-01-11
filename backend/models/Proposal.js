import mongoose from "mongoose";

const proposalSchema = new mongoose.Schema(
  {
    gig: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Gig",
      required: true,
    },
    freelancer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Freelancer", 
      required: true,
    },
    coverLetter: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    days: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "hired", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Proposal", proposalSchema);
