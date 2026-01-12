import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";
import {
  sendRequest,
  getMentorRequests,
  respondToRequest
} from "../controllers/mentorship.controller.js";

const router = express.Router();

// Student → send request
router.post(
  "/request",
  protect,
  requireRole("student"),
  sendRequest
);

// Mentor → view requests
router.get(
  "/requests",
  protect,
  requireRole("mentor"),
  getMentorRequests
);

// Mentor → accept / reject
router.patch(
  "/respond",
  protect,
  requireRole("mentor"),
  respondToRequest
);

export default router;
