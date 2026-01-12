import MentorshipRequest from "../models/MentorshipRequest.model.js";
import User from "../models/User.model.js";

/**
 * Student sends request to mentor
 */
export const sendRequest = async (req, res) => {
  try {
    const { mentorId, taskType, message } = req.body;
    const studentId = req.user.userId;

    // Ensure mentor exists & approved
    const mentor = await User.findOne({
      _id: mentorId,
      role: "mentor",
      mentorStatus: "approved"
    });

    if (!mentor) {
      return res.status(400).json({ message: "Invalid mentor" });
    }

    // Prevent duplicate pending requests
    const existing = await MentorshipRequest.findOne({
      student: studentId,
      mentor: mentorId,
      status: "pending"
    });

    if (existing) {
      return res.status(400).json({ message: "Request already pending" });
    }

    const request = await MentorshipRequest.create({
      student: studentId,
      mentor: mentorId,
      taskType,
      message
    });

    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Mentor views incoming requests
 */
export const getMentorRequests = async (req, res) => {
  const mentorId = req.user.userId;

  const requests = await MentorshipRequest.find({
    mentor: mentorId,
    status: "pending"
  })
    .populate("student", "name email")
    .sort({ createdAt: -1 });

  res.json(requests);
};

/**
 * Mentor accepts / rejects request
 */
export const respondToRequest = async (req, res) => {
  const mentorId = req.user.userId;
  const { requestId, action } = req.body;

  if (!["accept", "reject"].includes(action)) {
    return res.status(400).json({ message: "Invalid action" });
  }

  const request = await MentorshipRequest.findOne({
    _id: requestId,
    mentor: mentorId
  });

  if (!request) {
    return res.status(404).json({ message: "Request not found" });
  }

  request.status = action === "accept" ? "accepted" : "rejected";
  await request.save();

  res.json({ message: `Request ${request.status}` });
};
