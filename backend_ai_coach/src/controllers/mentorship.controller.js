import MentorshipRequest from "../models/MentorshipRequest.model.js";
import User from "../models/User.model.js";
import mongoose from "mongoose";
import ActiveMentorship from "../models/ActiveMentorship.model.js";



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

  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      const request = await MentorshipRequest.findOne({
        _id: requestId,
        mentor: mentorId,
        status: "pending"
      }).session(session);

      if (!request) {
        throw new Error("Request not found or already handled");
      }

      if (action === "reject") {
        request.status = "rejected";
        await request.save({ session });
        return;
      }

      // action === "accept"

      // 🔒 Prevent duplicate active mentorships
      const existingMentorship = await ActiveMentorship.findOne({
        student: request.student,
        mentor: request.mentor,
        status: "active"
      }).session(session);

      if (existingMentorship) {
        throw new Error("Active mentorship already exists");
      }

      request.status = "accepted";
      await request.save({ session });

      await ActiveMentorship.create(
        [
          {
            student: request.student,
            mentor: request.mentor,
            sourceRequest: request._id
          }
        ],
        { session }
      );
    });

    res.json({
      message:
        action === "accept"
          ? "Request accepted and mentorship started"
          : "Request rejected"
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  } finally {
    session.endSession();
  }
};



// Student views active mentorships
export const getStudentMentorships = async (req, res) => {
  try {
    const studentId = req.user.userId;

    const mentorships = await ActiveMentorship.find({
      student: studentId
    })
      .populate("mentor", "name email")
      .sort({ createdAt: -1 });

    res.json(mentorships);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Mentor views active mentorships
export const getMentorMentorships = async (req, res) => {
  try {
    const mentorId = req.user.userId;

    const mentorships = await ActiveMentorship.find({
      mentor: mentorId
    })
      .populate("student", "name email")
      .sort({ createdAt: -1 });

    res.json(mentorships);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
