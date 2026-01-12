import MentorProfile from "../models/MentorProfile.model.js";

export const getMentors = async (req, res) => {
  const { expertise } = req.query;

  const filter = {};

  if (expertise) {
    filter.expertise = { $in: [expertise] };
  }

  const mentors = await MentorProfile.find(filter)
    .populate("mentor", "name email")
    .sort({ createdAt: -1 });

  res.json(mentors);
};
