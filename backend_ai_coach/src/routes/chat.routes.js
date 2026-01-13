import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  sendMessage,
  getMessages
} from "../controllers/chat.controller.js";

const router = express.Router();

router.post(
  "/:mentorshipId/message",
  protect,
  sendMessage
);

router.get(
  "/:mentorshipId/messages",
  protect,
  getMessages
);

export default router;
