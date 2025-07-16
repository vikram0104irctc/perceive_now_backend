import mongoose from "mongoose";

const sourceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: {
      type: String,
      required: true,
      enum: [
        "internal-analysis",
        "third-party",
        "public-data",
        "expert-interview",
      ],
    },
    reliabilityScore: { type: Number, min: 0, max: 100 },
    description: { type: String },
    url: { type: String },
    date: { type: Date },
    referencedIn: [{ type: mongoose.Schema.Types.ObjectId, ref: "Report" }],
  },
  { timestamps: true }
);

const Source = mongoose.model("Source", sourceSchema);
export default Source;
