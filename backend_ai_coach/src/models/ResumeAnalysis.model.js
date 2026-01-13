import mongoose from "mongoose";

const ResumeAnalysisSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    resumeText: {
      type: String,
      required: true
    },

    aiFeedback: {
      type: String,
      required: true
    },

    score: {
      type: Number,
      min: 0,
      max: 100
    }
  },
  { timestamps: true }
);

export default mongoose.model(
  "ResumeAnalysis",
  ResumeAnalysisSchema
);
