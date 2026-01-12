import express from "express";
import User from "../models/User.model.js";
import { protect } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";
import MentorProfile from "../models/MentorProfile.model.js";

const router = express.Router();

// 1) View pending mentor applications
router.get(
  "/mentor-applications",
  protect,
  requireRole("admin"),
  async (req, res) => {
    const pendingMentors = await User.find({
      mentorStatus: "pending"
    }).select("-password");

    res.json(pendingMentors);
  }
);

// 2) Approve mentor
router.patch(
  "/approve-mentor/:userId",
  protect,
  requireRole("admin"),
  async (req, res) => {
    await User.findByIdAndUpdate(req.params.userId, {
      role: "mentor",
      mentorStatus: "approved"
    });

    res.json({ message: "Mentor approved" });
  }
);

// Reject mentor
router.patch(
  "/reject-mentor/:userId",
  protect,
  requireRole("admin"),
  async (req, res) => {
    await User.findByIdAndUpdate(req.params.userId, {
      mentorStatus: "rejected"
    });

    res.json({ message: "Mentor rejected" });
  }
);

// Enhanced approve mentor to create profile if not exists
router.patch(
  "/approve-mentor/:userId",
  protect,
  requireRole("admin"),
  async (req, res) => {
    const userId = req.params.userId;

    // 1. Update user role + status
    await User.findByIdAndUpdate(userId, {
      role: "mentor",
      mentorStatus: "approved"
    });

    // 2. Create mentor profile if not exists
    const exists = await MentorProfile.findOne({ mentor: userId });
    if (!exists) {
      await MentorProfile.create({ mentor: userId });
    }

    res.json({ message: "Mentor approved" });
  }
);

export default router;