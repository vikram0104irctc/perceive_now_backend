import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    reportId: { type: mongoose.Schema.Types.ObjectId, ref: "Report", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    userComment: { type: String, required: true },
    flaggedSection: { type: String },
    suggestedImprovements: { type: String },
    status: {
      type: String,
      enum: ["submitted", "under-review", "addressed", "rejected"],
      default: "submitted",
    },
    confidenceScoreImpact: { type: Number, min: 0, max: 100 },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Feedback = mongoose.model("Feedback", feedbackSchema);
export default Feedback;
