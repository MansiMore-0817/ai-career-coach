import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { getRoadmaps } from "../controllers/roadmap.controller.js";

const router = express.Router();

router.get("/", protect, getRoadmaps);

export default router;
