import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import testRoutes from "./routes/test.routes.js";
import roadmapRoutes from "./routes/roadmap.routes.js";
import progressRoutes from "./routes/progress.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import mentorRoutes from "./routes/mentor.routes.js";
import mentorshipRoutes from "./routes/mentorship.routes.js";



dotenv.config();
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/roadmaps", roadmapRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/mentors", mentorRoutes);
app.use("/api/mentorship", mentorshipRoutes);


// Health check route
app.get("/", (req, res) => {
  res.send("AI Career Coach Backend is Live ✅");
});

export default app;
