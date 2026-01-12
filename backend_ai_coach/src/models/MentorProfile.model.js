import mongoose from "mongoose";

const mentorProfileSchema = new mongoose.Schema(
  {
    mentor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },
    expertise: {
      type: [String],
      default: []
    },
    experienceYears: {
      type: Number,
      default: 0
    },
    bio: {
      type: String,
      default: ""
    },
    availability: {
      type: String,
      default: "Not specified"
    }
  },
  { timestamps: true }
);

export default mongoose.model("MentorProfile", mentorProfileSchema);
