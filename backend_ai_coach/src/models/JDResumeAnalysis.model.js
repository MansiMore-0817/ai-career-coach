import mongoose from "mongoose";
import { optional } from "zod";

const JDResumeAnalysisSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    companyName: {
      type: String,
    },

    role: {
      type: String,
      required: true,
    },

    currentLevel: {
      type: String,
    },

    experienceLevel: {
      type: String,
    },

    jobDescription: {
      type: String,
      required: true,
    },

    resumeText: {
      type: String,
      required: true,
    },

    aiResult: {
      type: Object,
      required: true,
    },

    extractionStatus: {
      type: String,
      enum: ["success", "failed"],
      default: "success",
    },
  },
  { timestamps: true }
);

export default mongoose.model("JDResumeAnalysis", JDResumeAnalysisSchema);
