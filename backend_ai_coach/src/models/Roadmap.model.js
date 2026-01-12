import mongoose from "mongoose";

const stepSchema = new mongoose.Schema({
  title: String,
  description: String,
  order: Number
});

const roadmapSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    role: {
      type: String,
      required: true
    },
    level: {
      type: String,
      required: true
    },
    steps: [stepSchema]
  },
  { timestamps: true }
);

export default mongoose.model("Roadmap", roadmapSchema);
