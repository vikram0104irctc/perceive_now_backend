import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    summary: { type: String, required: true },
    content: { type: String, required: true },
    confidenceScore: { type: Number, required: true, min: 0, max: 100 },
    reportType: {
      type: String,
      required: true,
      enum: [
        "market-analysis",
        "financial-forecast",
        "competitive-intel",
        "risk-assessment",
      ],
    },
    industry: {
      type: String,
      required: true,
      enum: [
        "finance",
        "healthcare",
        "technology",
        "retail",
        "manufacturing",
        "energy",
      ],
    },
    tags: [{ type: String }],
    sources: [{ type: mongoose.Schema.Types.ObjectId, ref: "Source" }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Report = mongoose.model("Report", reportSchema);
export default Report;
