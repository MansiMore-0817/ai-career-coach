import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { toggleProgress } from "../controllers/progress.controller.js";

const router = express.Router();

router.patch("/toggle", protect, toggleProgress);

export default router;
