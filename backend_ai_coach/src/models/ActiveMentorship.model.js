import mongoose from "mongoose";

const ActiveMentorshipSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    mentor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    sourceRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MentorshipRequest",
      required: true,
      unique: true
    },

    status: {
      type: String,
      enum: ["active", "completed", "terminated"],
      default: "active",
      index: true
    },

    startedAt: {
      type: Date,
      default: Date.now
    },

    endedAt: {
      type: Date
    },

    terminationReason: {
      type: String
    }
  },
  { timestamps: true }
);

// prevent duplicate active mentorships
ActiveMentorshipSchema.index(
  { student: 1, mentor: 1, status: 1 },
  {
    unique: true,
    partialFilterExpression: { status: "active" }
  }
);

export default mongoose.model(
  "ActiveMentorship",
  ActiveMentorshipSchema
);
