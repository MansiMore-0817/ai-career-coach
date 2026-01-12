import mongoose from "mongoose";

const mentorshipRequestSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    mentor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    taskType: {
      type: String,
      enum: ["resume_review", "career_guidance", "roadmap_help"],
      required: true
    },
    message: {
      type: String,
      default: ""
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending"
    }
  },
  { timestamps: true }
);

export default mongoose.model("MentorshipRequest", mentorshipRequestSchema);
