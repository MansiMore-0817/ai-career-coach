import Roadmap from "../models/Roadmap.model.js";

export const getRoadmaps = async (req, res) => {
  const roadmaps = await Roadmap.find();
  res.json(roadmaps);
};
