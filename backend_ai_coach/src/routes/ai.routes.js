import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  analyzeResume,
  analyzeResumeWithJD,
  getResumeHistory,
  analyzeResumeWithJDAdvanced,
  getAdvancedJDAnalysisHistory,
  analyzeResumeWithJDAdvancedUpload,
} from "../controllers/ai.controller.js";
import upload from "../middleware/upload.middleware.js";

const router = express.Router();

// Student → resume analysis
router.post("/resume/analyze", protect, analyzeResume);

router.get("/resume/history", protect, getResumeHistory);

// Route for Jd based resume analysis
router.post("/resume/jd-analyze", protect, analyzeResumeWithJD);

// Route for Advanced Jd based resume analysis
router.post(
  "/resume/jd-analyze-advanced",
  protect,
  analyzeResumeWithJDAdvanced
);

// get adv jd analysis history
router.get(
  "/resume/jd-analyze-advanced/history",
  protect,
  getAdvancedJDAnalysisHistory
);

router.post(
  "/resume/jd-analyze-advanced/upload",
  upload.fields([{ name: "resume", maxCount: 1 }]),
  protect,
  analyzeResumeWithJDAdvancedUpload
);


export default router;
