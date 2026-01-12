import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { getMentors } from "../controllers/mentor.controller.js";

const router = express.Router();

// Students can browse mentors
router.get("/", protect, getMentors);

export default router;
